import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { formatPrice } from "../utils/format.js";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl.js";
import { useCart } from "../store/cart.js";

export function CatalogProductCard({ product }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <article className="group flex h-full flex-col border-2 border-base-300 bg-base-100 transition-colors hover:border-primary">
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden border-b-2 border-base-300"
      >
        <figure className="aspect-4/3 bg-base-200">
          {product.imageUrl ? (
            <img
              src={imageKitOptimizedUrl(product.imageUrl, IK_PRESETS.catalogCard)}
              alt=""
              className="h-full w-full object-cover grayscale-[0.4] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </figure>
        <span className="absolute left-0 top-0 border-b-2 border-r-2 border-base-300 bg-base-100 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-base-content/70">
          {product.category ?? "General"}
        </span>
        <span className="absolute right-0 top-0 bg-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary-content opacity-0 transition-opacity group-hover:opacity-100">
          View →
        </span>
      </Link>

      <div className="flex grow flex-col p-4 text-left md:p-5">
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-base font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-primary md:text-lg"
        >
          {product.name}
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-base-content/60">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-base-300 pt-4 font-mono">
          <span className="text-lg font-bold tabular-nums text-base-content">
            {formatPrice(product.priceCents, product.currency)}
          </span>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="inline-flex items-center gap-1.5 border-2 border-base-300 bg-base-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-base-content transition-colors hover:border-primary hover:bg-primary hover:text-primary-content"
          >
            <PlusIcon className="size-3.5" aria-hidden />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
