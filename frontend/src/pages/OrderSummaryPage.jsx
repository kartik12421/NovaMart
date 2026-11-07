import { ListOrderedIcon, PackageIcon } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl";
import { formatPrice } from "../utils/format";

function OrderSummaryPage() {
  const { order, items } = useOutletContext();

  return (
    <div className="border-2 border-base-300 bg-base-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-base-300 bg-base-200/60 px-5 py-3 sm:px-6">
        <h2 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-base-content">
          <ListOrderedIcon className="size-4 text-primary" aria-hidden />
          Line items
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/45">
          {items.length} {items.length === 1 ? "product" : "products"} in this order
        </p>
      </div>

      <ul className="divide-y-2 divide-base-300">
        {items.map((row) => (
          <li key={row.id} className="px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex flex-1 gap-4">
                <Link
                  to={`/product/${row.product.slug}`}
                  className="group/img relative shrink-0 overflow-hidden border-2 border-base-300 bg-base-200 transition-colors group-hover/img:border-primary"
                >
                  <div className="h-24 w-24 sm:h-28 sm:w-28">
                    {row.product.imageUrl ? (
                      <img
                        src={imageKitOptimizedUrl(row.product.imageUrl, IK_PRESETS.orderLineThumb)}
                        alt=""
                        className="h-full w-full object-cover grayscale-[0.4] transition duration-300 group-hover/img:grayscale-0"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PackageIcon className="size-10 text-base-content/30" aria-hidden />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${row.product.slug}`}
                    className="text-base font-bold uppercase leading-snug tracking-tight text-base-content transition-colors hover:text-primary sm:text-lg"
                  >
                    {row.product.name}
                  </Link>
                  {row.product.category ? (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/50">
                      {row.product.category}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.12em] text-base-content/60">
                    <span>Qty {row.quantity}</span>
                    <span className="text-base-content/30">·</span>
                    <span>{formatPrice(row.unitPriceCents, row.product.currency)} each</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col border-t-2 border-base-300 pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/45">
                  Subtotal
                </span>
                <span className="font-mono text-xl font-bold tabular-nums text-base-content">
                  {formatPrice(row.unitPriceCents * row.quantity, row.product.currency)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t-2 border-base-300 bg-base-200/60 px-5 py-4 sm:px-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-base-content">
          Total
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-primary">
          {formatPrice(order.totalCents, "usd")}
        </span>
      </div>
    </div>
  );
}
export default OrderSummaryPage;
