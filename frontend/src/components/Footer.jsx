import { Link } from "react-router";
import { HeadphonesIcon, RadioIcon } from "lucide-react";

const YEAR = new Date().getFullYear();

const columns = [
  {
    index: "01",
    title: "Shop",
    links: [
      { to: "/", label: "All products" },
      { to: "/cart", label: "Cart" },
      { to: "/orders", label: "Orders" },
    ],
  },
  {
    index: "02",
    title: "Support",
    links: [{ to: "/orders", label: "Order chat" }],
    note: "After payment, open your order to chat. Video links are shared in that thread.",
  },
  {
    index: "03",
    title: "Company",
    links: [{ to: "/#catalog", label: "Catalog" }],
    note: "Built for people who care about clear specs, fast fulfillment, and human support.",
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid divide-y-2 divide-base-300 md:grid-cols-4 md:divide-x-2 md:divide-y-0">
          <div className="py-8 md:pr-6">
            <div className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-tight text-base-content">
              <span className="flex size-7 items-center justify-center bg-primary text-primary-content">
                <RadioIcon className="size-4" aria-hidden />
              </span>
              NovaMart Supply
            </div>
            <p className="mt-4 text-sm leading-relaxed text-base-content/60">
              Curated hardware and workspace tools. Paid orders include priority support — chat
              with the team and join a video call when we share a link.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/35">
              Est. — shipping worldwide
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="py-8 md:px-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                {col.index} — {col.title}
              </h3>

              {col.links?.length ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link
                        to={l.to}
                        className="font-medium uppercase tracking-wide text-base-content/80 transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              {col.note ? (
                <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-base-content/55">
                  {col.title === "Support" ? (
                    <HeadphonesIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  ) : null}
                  <span>{col.note}</span>
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {/* oversized ghost wordmark */}
        <div className="overflow-hidden border-t-2 border-base-300 py-6 md:py-8">
          <p className="select-none text-center text-[clamp(3rem,13vw,10rem)] font-bold uppercase leading-none tracking-tighter text-base-300">
            NovaMart
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t-2 border-base-300 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {YEAR} NovaMart Supply</span>
          <span>All prices in USD</span>
          <span className="text-primary">Built for the desk</span>
        </div>
      </div>
    </footer>
  );
}
