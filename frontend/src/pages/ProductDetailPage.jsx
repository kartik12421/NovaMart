import { Link } from "react-router";
import { ProductPageSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { useProductPage } from "../hooks/useProductPage";
import { IK_PRESETS, imageKitOptimizedUrl, imageKitWatermarkedUrl } from "../lib/imagekitUrl";
import { useCart } from "../store/cart";
import { ArrowLeftIcon, CheckIcon, ExternalLinkIcon, ShoppingCartIcon } from "lucide-react";
import { formatPrice } from "../utils/format";

const HIGHLIGHTS = [
  "Secure checkout",
  "Support from your order after payment",
  "Specs listed for this catalog",
];

function ProductDetailPage() {
  const addItem = useCart((s) => s.addItem);
  const { product, isLoading, error } = useProductPage();

  if (isLoading) return <ProductPageSkeleton />;

  if (error || !product) {
    return <PageError message="Product not found." action={{ to: "/", label: "Back to shop" }} />;
  }

  const p = product;
  const category = p.category ?? "General";
  const watermarkedFullUrl = p.imageUrl
    ? imageKitWatermarkedUrl(p.imageUrl, IK_PRESETS.productHero)
    : null;

  return (
    <div>
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-base-content/45"
      >
        <Link to="/" className="transition-colors hover:text-primary">
          Shop
        </Link>
        <span aria-hidden>/</span>
        <Link
          to={`/?category=${encodeURIComponent(category)}`}
          className="transition-colors hover:text-primary"
        >
          {category}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-base-content">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="border-2 border-base-300 bg-base-100">
          <figure className="aspect-square bg-base-200">
            {p.imageUrl ? (
              <img
                src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.productHero)}
                alt=""
                className="h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </figure>

          {watermarkedFullUrl ? (
            <div className="flex flex-wrap items-center gap-2 border-t-2 border-base-300 bg-base-200/60 px-3 py-2">
              <a
                className="inline-flex items-center gap-1.5 px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/60 transition-colors hover:text-primary"
                href={watermarkedFullUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="size-3.5" aria-hidden />
                Open full size
              </a>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              [ {category} ]
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-base-content/35">
              {p.slug}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl">
            {p.name}
          </h1>

          <p className="mt-4 font-mono text-3xl font-bold tabular-nums text-primary md:text-4xl">
            {formatPrice(p.priceCents, p.currency)}
          </p>

          <p className="mt-6 text-base leading-relaxed text-base-content/80">{p.description}</p>

          <ul className="mt-6 border-2 border-base-300 bg-base-200/50">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h}
                className="flex items-center gap-3 border-b border-dashed border-base-300 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-base-content/75 last:border-b-0"
              >
                <CheckIcon className="size-4 shrink-0 text-success" aria-hidden />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem(p.id)}
              className="btn-brutal inline-flex items-center gap-2 border-2 border-primary bg-primary px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
            >
              <ShoppingCartIcon className="size-4" aria-hidden />
              Add to cart
            </button>

            <Link
              to="/"
              className="btn-brutal inline-flex items-center gap-2 border-2 border-base-300 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-base-content hover:border-base-content"
            >
              <ArrowLeftIcon className="size-4" aria-hidden />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
