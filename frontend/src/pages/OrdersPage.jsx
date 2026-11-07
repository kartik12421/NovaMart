import { ChevronRightIcon } from "lucide-react";
import { OrdersListSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { PageHeader } from "../components/PageHeader";
import useOrdersPage from "../hooks/useOrdersPage";
import { Link } from "react-router";
import { OrderPreview } from "../components/OrderPreview";
import { formatOrderWhen, formatPrice } from "../utils/format";

function OrdersPage() {
  const { isLoading, error, orders, staff } = useOrdersPage();

  if (isLoading) {
    return (
      <div className="text-left">
        <div className="skeleton mb-2 h-4 w-32" />
        <div className="skeleton mb-3 h-10 w-64 max-w-full" />
        <div className="skeleton mb-8 h-4 w-96 max-w-full" />
        <OrdersListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <PageError message="Could not load orders." action={{ to: "/", label: "Back to shop" }} />
    );
  }

  return (
    <div className="text-left">
      <PageHeader
        index="04 / Orders"
        title={staff ? "Orders" : "Your orders"}
        note={
          staff
            ? "All store orders. Open one for customer support chat."
            : "Paid orders include customer support: open an order for chat."
        }
      />

      {orders.length === 0 ? (
        <div className="border-2 border-dashed border-base-300 px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-base-content/50">
            No orders yet.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex border-2 border-base-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-base-content transition-colors hover:border-primary hover:bg-primary hover:text-primary-content"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => {
            const previewItems = o.previewItems ?? [];
            const totalUnits = previewItems.reduce((sum, row) => sum + row.quantity, 0);
            const lineCount = previewItems.length;
            const summary =
              lineCount === 0
                ? "No line items"
                : lineCount === 1
                  ? `${totalUnits} ${totalUnits === 1 ? "item" : "items"}`
                  : `${lineCount} products · ${totalUnits} items`;

            return (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="group flex border-2 border-base-300 bg-base-100 transition-colors hover:border-primary"
                >
                  <div className="hidden shrink-0 items-center border-r-2 border-base-300 p-4 sm:flex">
                    <OrderPreview items={previewItems} />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 py-4 pl-4 pr-4 sm:gap-5 sm:pl-5">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-base-content/55 sm:text-sm">
                          {o.id.slice(0, 8)}…
                        </span>

                        <span
                          className={`badge badge-sm font-mono uppercase tracking-widest ${
                            o.status === "paid"
                              ? "badge-success"
                              : o.status === "pending"
                                ? "badge-warning"
                                : "badge-error"
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>

                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-base-content/50">
                        {formatOrderWhen(o.createdAt)}
                      </p>

                      <p className="mt-2 text-sm text-base-content/75">{summary}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/45">
                          Total
                        </p>
                        <p className="text-lg font-bold tabular-nums text-base-content sm:text-xl">
                          {formatPrice(o.totalCents, "usd")}
                        </p>
                      </div>
                      <ChevronRightIcon
                        className="size-5 shrink-0 text-base-content/40 transition group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
export default OrdersPage;
