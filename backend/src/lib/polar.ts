import type { Env } from "./env.js";

type CheckoutCreateBody = {
  products: string[];
  prices?: Record<
    string,
    Array<{
      amount_type: "fixed";
      price_amount: number;
      price_currency: string;
    }>
  >;
  /** Presentment currency the customer is charged in. */
  currency?: string;
  success_url: string;
  return_url?: string;
  external_customer_id?: string;
  customer_email?: string;
  metadata?: Record<string, string | number | boolean>;
};

export async function polarCreateCheckout(env: Env, body: CheckoutCreateBody) {
  const token = env.POLAR_ACCESS_TOKEN;
  if (!token) throw new Error("POLAR_ACCESS_TOKEN is not configured");

  const res = await fetch(`${env.POLAR_API_BASE}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Polar checkout failed: ${res.status} ${errText}`);
  }

  const data = (await res.json()) as { id: string; url: string };
  return { id: data.id, url: data.url };
}

export async function polarGetCheckout(env: Env, checkoutId: string) {
  const token = env.POLAR_ACCESS_TOKEN;
  if (!token) throw new Error("POLAR_ACCESS_TOKEN is not configured");

  const res = await fetch(`${env.POLAR_API_BASE}/v1/checkouts/${encodeURIComponent(checkoutId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Polar checkout lookup failed: ${res.status} ${errText}`);
  }

  return (await res.json()) as {
    id: string;
    status: "open" | "expired" | "confirmed" | "succeeded" | "failed";
    metadata?: Record<string, unknown>;
    external_customer_id?: string | null;
  };
}
