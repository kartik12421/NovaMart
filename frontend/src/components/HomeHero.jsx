import { Link } from "react-router";
import { ArrowDownIcon, ShoppingCartIcon } from "lucide-react";

const SPECS = [
  { label: "Fulfillment", value: "Same week" },
  { label: "Currency", value: "USD" },
  { label: "Checkout", value: "Encrypted" },
  { label: "Support", value: "Chat + video" },
];

export function HomeHero({ categories, loadingCategories }) {
  return (
    <section className="border-2 border-base-300 bg-base-100">
      {/* top status rule */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b-2 border-base-300 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/45 md:px-6">
        <span>NovaMart — supply index</span>
        <span className="flex items-center gap-2 text-primary">
          <span className="size-1.5 bg-primary" aria-hidden />
          In stock · ships this week
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.55fr_1fr]">
        {/* headline block */}
        <div className="border-b-2 border-base-300 px-4 py-10 md:px-8 md:py-14 lg:border-r-2 lg:border-b-0">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
            01 / Store
          </p>

          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
            Audio. Wearables.
            <br />
            Workspace.
            <span className="mt-1 block text-primary">Ready to ship.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-base-content/65">
            Curated gear for work and home — no filler, priced in USD. Pay securely, then run
            everything from your order page: support chat and video calls live there.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="btn-brutal inline-flex items-center gap-2 border-2 border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
            >
              Browse catalog
              <ArrowDownIcon className="size-4" aria-hidden />
            </a>

            <Link
              to="/cart"
              className="btn-brutal inline-flex items-center gap-2 border-2 border-base-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-base-content hover:border-base-content"
            >
              <ShoppingCartIcon className="size-4" aria-hidden />
              View cart
            </Link>
          </div>
        </div>

        {/* spec sheet */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b-2 border-base-300 bg-base-200/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/45 md:px-6">
            <span>Spec</span>
            <span>Status</span>
          </div>

          <dl className="px-4 md:px-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-base-300 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em]">
              <dt className="text-base-content/50">Categories</dt>
              <dd className="font-bold tabular-nums text-base-content">
                {loadingCategories ? (
                  <span className="skeleton inline-block h-4 w-10" aria-hidden />
                ) : (
                  categories.length
                )}
              </dd>
            </div>

            {SPECS.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-base-300 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em]"
              >
                <dt className="text-base-content/50">{label}</dt>
                <dd className="font-bold text-base-content">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto border-t-2 border-base-300 bg-primary px-4 py-4 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-[0.14em] text-primary-content md:px-6">
            Secure checkout — priority support on paid orders
          </div>
        </div>
      </div>
    </section>
  );
}
