import {
  HeadphonesIcon,
  LogInIcon,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import useCartPage from "../hooks/useCartPage";
import EmptyCart from "../components/EmptyCart";
import { CartSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { PageHeader } from "../components/PageHeader";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl";
import { Link } from "react-router";
import { formatPrice } from "../utils/format";
import { Show, SignInButton } from "@clerk/react";

function CartPage() {
  const {
    checkout,
    checkoutLoading,
    items,
    lines,
    productsError,
    productsLoading,
    removeItem,
    setQty,
    subtotal,
  } = useCartPage();

  return (
    <div className="text-left">
      <PageHeader
        index="03 / Cart"
        title="Your cart"
        note="Quantities are yours to set — nothing is charged until checkout."
      />

      {items.length === 0 ? (
        <EmptyCart />
      ) : productsLoading ? (
        <CartSkeleton lines={items.length} />
      ) : productsError ? (
        <PageError message="Could not load product details. Refresh the page or try again shortly." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {lines.map(({ line, product: p }) => (
              <li
                key={line.productId}
                className="flex border-2 border-base-300 bg-base-100"
              >
                <div className="shrink-0 border-r-2 border-base-300 p-4">
                  {p?.imageUrl ? (
                    <img
                      src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.cartThumb)}
                      alt=""
                      className="h-24 w-24 bg-base-200 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-base-200" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-bold uppercase leading-tight tracking-tight">
                      {p ? (
                        <Link
                          to={`/product/${p.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {p.name}
                        </Link>
                      ) : (
                        "Unknown product"
                      )}
                    </div>
                    {p ? (
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-base-content/55">
                        {formatPrice(p.priceCents, p.currency)} each
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/50">
                        Qty
                      </span>
                      <div className="join border-2 border-base-300">
                        <button
                          type="button"
                          className="btn btn-sm join-item gap-0 px-2.5"
                          onClick={() => setQty(line.productId, line.quantity - 1)}
                          aria-label={line.quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
                        >
                          <MinusIcon className="size-4" aria-hidden />
                        </button>
                        <span
                          className="join-item flex min-w-10 items-center justify-center bg-base-200 px-3 font-mono text-sm font-bold tabular-nums text-base-content"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm join-item gap-0 px-2.5"
                          onClick={() => setQty(line.productId, Math.min(99, line.quantity + 1))}
                          disabled={line.quantity >= 99}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="size-4" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                        aria-label="Remove from cart"
                        title="Remove from cart"
                      >
                        <Trash2Icon className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-base font-bold tabular-nums text-base-content">
                    {p ? formatPrice(p.priceCents * line.quantity, p.currency) : "-"}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border-2 border-base-300 bg-base-100">
            <div className="border-b-2 border-base-300 bg-base-200/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/45">
              Summary
            </div>

            <div className="px-5 py-4">
              <div className="flex justify-between font-mono text-sm">
                <span className="uppercase tracking-[0.15em] text-base-content/60">Subtotal</span>
                <span className="font-bold tabular-nums text-base-content">
                  {formatPrice(subtotal, lines[0]?.product?.currency ?? "usd")}
                </span>
              </div>

              <Show when="signed-in">
                <button
                  type="button"
                  onClick={checkout}
                  disabled={checkoutLoading}
                  aria-busy={checkoutLoading}
                  className="btn-brutal mt-5 flex w-full items-center justify-center gap-2 border-2 border-primary bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
                >
                  {checkoutLoading ? (
                    <span className="loading loading-spinner loading-sm" aria-hidden />
                  ) : null}
                  {checkoutLoading ? "Opening checkout…" : "Checkout securely"}
                </button>
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="btn-brutal mt-5 flex w-full items-center justify-center gap-2 border-2 border-base-300 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-base-content hover:border-base-content"
                  >
                    <LogInIcon className="size-4" aria-hidden />
                    Sign in to checkout
                  </button>
                </SignInButton>
              </Show>

              <p className="mt-4 flex items-start gap-2 border-t border-dashed border-base-300 pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-base-content/55">
                <HeadphonesIcon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                <span>
                  After payment, open your order for{" "}
                  <strong className="text-base-content">support chat</strong>. Video invites
                  appear in that thread.
                </span>
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
export default CartPage;
