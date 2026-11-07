import { ArrowRightIcon, PackageIcon, ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router";

export default function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg border-2 border-dashed border-base-300 bg-base-100 px-6 py-14 text-center sm:px-10 sm:py-16">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center border-2 border-base-300 bg-base-200 text-primary">
        <ShoppingCartIcon className="size-8" aria-hidden />
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">03 / Empty</p>

      <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Your cart is empty
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-base-content/60">
        When you add products from the catalog, they&apos;ll show up here. Ready when you are.
      </p>

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/#catalog"
          className="btn-brutal inline-flex items-center justify-center gap-2 border-2 border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
        >
          Browse catalog
          <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
        <Link
          to="/orders"
          className="btn-brutal inline-flex items-center justify-center gap-2 border-2 border-base-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-base-content hover:border-base-content"
        >
          <PackageIcon className="size-4" aria-hidden />
          View orders
        </Link>
      </div>
    </div>
  );
}
