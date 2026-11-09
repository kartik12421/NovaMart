import { Link, useSearchParams } from "react-router";
import { useCart } from "../store/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { apiFetch } from "../lib/api";
import { CheckIcon, CircleAlertIcon, LoaderCircleIcon, PackageIcon } from "lucide-react";

function CheckoutReturnPage() {
  const clearCart = useCart((s) => s.clear);
  const [params] = useSearchParams();
  const checkoutId = params.get("checkout_id");
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const checkoutQuery = useQuery({
    queryKey: ["checkout-status", checkoutId],
    queryFn: () => apiFetch(`/api/checkout/${encodeURIComponent(checkoutId)}/status`, { getToken }),
    enabled: Boolean(checkoutId && isLoaded && isSignedIn),
    refetchInterval: (query) => (query.state.data?.status === "pending" ? 2000 : false),
    retry: 1,
  });
  const status = checkoutQuery.data?.status;

  useEffect(() => {
    if (status === "paid") {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  }, [status, queryClient, clearCart]);

  const paid = status === "paid";
  const failed =
    status === "failed" ||
    checkoutQuery.isError ||
    (!checkoutId && isLoaded) ||
    (isLoaded && !isSignedIn);
  const title = paid
    ? "Thanks for your order"
    : failed
      ? "We couldn’t confirm this payment"
      : "Confirming your payment";

  return (
    <div className="mx-auto max-w-lg border-2 border-base-300 bg-base-100 px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex size-16 items-center justify-center border-2 border-success bg-success/10 text-success">
        {paid ? (
          <CheckIcon className="size-8" aria-hidden />
        ) : failed ? (
          <CircleAlertIcon className="size-8" aria-hidden />
        ) : (
          <LoaderCircleIcon className="size-8 animate-spin" aria-hidden />
        )}
      </div>

      <p
        className={`mt-6 font-mono text-[11px] uppercase tracking-[0.3em] ${
          paid ? "text-success" : failed ? "text-error" : "text-base-content/60"
        }`}
      >
        {paid ? "Payment confirmed" : failed ? "Confirmation needed" : "Checking with Polar"}
      </p>

      <h1 className="mt-3 text-2xl font-bold uppercase tracking-tight sm:text-3xl">{title}</h1>

      <p className="mt-4 text-sm leading-relaxed text-base-content/70">
        {paid
          ? "Your order is ready. Open it from your orders list for support chat."
          : failed
            ? checkoutQuery.error?.message ??
              "Sign in and reopen this page, or check your orders before trying the payment again."
            : "We’re verifying the payment and preparing your order. This page will update automatically."}
      </p>

      {checkoutId ? (
        <p className="mt-3 break-all font-mono text-[11px] uppercase tracking-[0.15em] text-base-content/45">
          Checkout: {checkoutId}
        </p>
      ) : null}

      {paid ? (
        <Link
          to="/orders"
          className="btn-brutal mt-8 inline-flex items-center gap-2 border-2 border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
        >
          <PackageIcon className="size-4" aria-hidden />
          View orders
        </Link>
      ) : null}
    </div>
  );
}

export default CheckoutReturnPage;
