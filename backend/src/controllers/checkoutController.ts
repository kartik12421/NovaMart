import type { Request, Response, NextFunction } from "express";
import { getEnv } from "../lib/env.js";
import z from "zod";
import { getAuth } from "@clerk/express";
import { getLocalUser } from "../lib/users.js";
import { db } from "../db/index.js";
import { CheckoutSessionLine, checkoutSessions, orderItems, orders, products } from "../db/schema.js";
import { and, eq, inArray } from "drizzle-orm";
import { polarCreateCheckout, polarGetCheckout } from "../lib/polar.js";

const env = getEnv();

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function createCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    // only signed-in users can start checkout
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = cartSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid cart", details: parsed.error.flatten() });
      return;
    }

    // polar access token is required
    if (!env.POLAR_ACCESS_TOKEN) {
      res.status(503).json({ error: "Payments are not configured" });
      return;
    }

    const localUser = await getLocalUser(userId);
    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const ids = parsed.data.items.map((i) => i.productId);

    // load every cart product that exists, is active, and matches the IDs we asked for.
    const prodRows = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.active, true)));

    if (prodRows.length !== ids.length) {
      res.status(400).json({ error: "One or more products are invalid" });
      return;
    }

    const byId = new Map(prodRows.map((p) => [p.id, p]));
    let totalCents = 0;
    const lines: CheckoutSessionLine[] = [];

    for (const line of parsed.data.items) {
      const p = byId.get(line.productId)!;
      totalCents += p.priceCents * line.quantity;
      lines.push({
        productId: p.id,
        quantity: line.quantity,
        unitPriceCents: p.priceCents,
      });
    }

    // Polar rejects ad-hoc prices below the per-currency minimum ($0.50 for USD).
    if (totalCents < 50) {
      res.status(400).json({
        error: "Total below Polar minimum (USD requires at least 50 cents)",
      });
      return;
    }

    const [session] = await db
      .insert(checkoutSessions)
      .values({
        userId: localUser.id,
        lines,
        totalCents,
        currency: "usd",
      })
      .returning();

    const successUrl = `${env.FRONTEND_URL}/checkout/return?checkout_id={CHECKOUT_ID}`;
    const returnUrl = `${env.FRONTEND_URL}/cart`;

    const checkout = await polarCreateCheckout(env, {
      products: [env.POLAR_CHECKOUT_PRODUCT_ID],
      // Match the Polar organization's USD presentment currency.
      currency: "usd",
      prices: {
        [env.POLAR_CHECKOUT_PRODUCT_ID]: [
          {
            amount_type: "fixed",
            price_currency: "usd",
            price_amount: totalCents,
          },
        ],
      },

      success_url: successUrl,
      return_url: returnUrl,
      external_customer_id: userId,
      metadata: { checkout_session_id: session.id },
    });

    await db
      .update(checkoutSessions)
      .set({ polarCheckoutId: checkout.id })
      .where(eq(checkoutSessions.id, session.id));

    res.json({ checkoutUrl: checkout.url });
  } catch (e) {
    next(e);
  }
}

export async function confirmCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const localUser = await getLocalUser(userId);
    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const checkoutId = req.params.id as string;
    const [session] = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.polarCheckoutId, checkoutId))
      .limit(1);

    if (!session || session.userId !== localUser.id) {
      const [existingOrder] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.polarCheckoutId, checkoutId), eq(orders.userId, localUser.id)))
        .limit(1);

      if (existingOrder) {
        res.json({ status: "paid", orderId: existingOrder.id });
        return;
      }

      res.status(404).json({ error: "Checkout not found" });
      return;
    }

    const checkout = await polarGetCheckout(env, checkoutId);
    if (
      checkout.id !== checkoutId ||
      checkout.external_customer_id !== userId ||
      checkout.metadata?.checkout_session_id !== session.id
    ) {
      res.status(403).json({ error: "Checkout does not match this account" });
      return;
    }

    if (checkout.status !== "succeeded") {
      res.json({ status: checkout.status === "failed" || checkout.status === "expired" ? "failed" : "pending" });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [lockedSession] = await tx
        .select()
        .from(checkoutSessions)
        .where(eq(checkoutSessions.id, session.id))
        .for("update");

      if (!lockedSession) {
        const [existingOrder] = await tx
          .select()
          .from(orders)
          .where(and(eq(orders.polarCheckoutId, checkoutId), eq(orders.userId, localUser.id)))
          .limit(1);
        return existingOrder ? { orderId: existingOrder.id } : null;
      }

      const [order] = await tx
        .insert(orders)
        .values({
          userId: lockedSession.userId,
          status: "paid",
          totalCents: lockedSession.totalCents,
          polarCheckoutId: checkoutId,
        })
        .returning();

      if (lockedSession.lines.length) {
        await tx.insert(orderItems).values(
          lockedSession.lines.map((line) => ({
            orderId: order.id,
            productId: line.productId,
            quantity: line.quantity,
            unitPriceCents: line.unitPriceCents,
          })),
        );
      }

      await tx.delete(checkoutSessions).where(eq(checkoutSessions.id, lockedSession.id));
      return { orderId: order.id };
    });

    if (!result) {
      res.status(500).json({ error: "Could not create order for completed checkout" });
      return;
    }

    res.json({ status: "paid", orderId: result.orderId });
  } catch (e) {
    next(e);
  }
}
