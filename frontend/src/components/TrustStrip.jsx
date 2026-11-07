import {
  CreditCardIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchIcon,
  PackageCheckIcon,
} from "lucide-react";

const items = [
  { icon: TruckIcon, label: "Same-week fulfillment" },
  { icon: ShieldCheckIcon, label: "Encrypted checkout" },
  { icon: CreditCardIcon, label: "Prices in USD" },
  { icon: HeadphonesIcon, label: "Order-page support chat" },
  { icon: WrenchIcon, label: "Specs listed, no filler" },
  { icon: PackageCheckIcon, label: "Stock counted daily" },
];

function Row({ hidden = false }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 pr-8"
      aria-hidden={hidden ? "true" : undefined}
    >
      {items.map(({ icon: IconCmp, label }) => (
        <span key={label} className="flex items-center gap-2.5 whitespace-nowrap">
          <IconCmp className="size-4 text-primary" aria-hidden />
          {label}
          <span className="text-base-content/25" aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

export function TrustStrip() {
  return (
    <section
      aria-label="Store highlights"
      className="ticker overflow-hidden border-2 border-base-300 bg-base-200/60 py-3"
    >
      <div className="flex w-max animate-marquee font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-base-content/70">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
