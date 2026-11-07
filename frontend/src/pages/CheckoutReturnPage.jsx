import { Link, useSearchParams } from "react-router";
import { useCart } from "../store/cart";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CheckIcon, PackageIcon } from "lucide-react";

function CheckoutReturnPage() {
  const clearCart = useCart((s) => s.clear);

  const [params] = useSearchParams();
  const checkoutId = params.get("checkout_id");

  const queryClient = useQueryClient();

  useEffect(() => {
    clearCart();
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient, clearCart]);

  return (
    <div className="mx-auto max-w-lg border-2 border-base-300 bg-base-100 px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex size-16 items-center justify-center border-2 border-success bg-success/10 text-success">
        <CheckIcon className="size-8" aria-hidden />
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-success">
        Payment received
      </p>

      <h1 className="mt-3 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Thanks for your order
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-base-content/70">
        Your order is created after payment is confirmed. Open it from your orders list for{" "}
        <strong className="text-base-content">support chat</strong> (it appears there as{" "}
        <strong className="text-base-content">paid</strong>). We&apos;ll send video invites in
        that thread when needed.
      </p>

      {checkoutId ? (
        <p className="mt-3 break-all font-mono text-[11px] uppercase tracking-[0.15em] text-base-content/45">
          Checkout: {checkoutId}
        </p>
      ) : null}

      <Link
        to="/orders"
        className="btn-brutal mt-8 inline-flex items-center gap-2 border-2 border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
      >
        <PackageIcon className="size-4" aria-hidden />
        View orders
      </Link>
    </div>
  );
}

export default CheckoutReturnPage;
