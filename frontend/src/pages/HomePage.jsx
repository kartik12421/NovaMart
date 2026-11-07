import { CatalogProductCard } from "../components/CatalogProductCard";
import { HomeHero } from "../components/HomeHero";
import { PageError } from "../components/PageError";
import { TrustStrip } from "../components/TrustStrip";
import { useHomeCatalog } from "../hooks/useHomeCatalog";

function HomePage() {
  const {
    products,
    categories,
    categoryChipsLoading,
    categoryFilter,
    error,
    loadingCategories,
    loadingList,
    setCategory,
  } = useHomeCatalog();

  const chipClass = (active) =>
    `border-2 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
      active
        ? "border-primary bg-primary text-primary-content"
        : "border-base-300 text-base-content/70 hover:border-base-content hover:text-base-content"
    }`;

  return (
    <div className="space-y-10">
      <HomeHero categories={categories} loadingCategories={loadingCategories} />

      <TrustStrip />

      {/* CATALOG */}
      <section id="catalog" className="scroll-mt-24">
        <div className="mb-6 flex flex-col gap-4 border-b-2 border-base-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
              02 / Catalog
            </p>
            <h2 className="mt-1.5 flex items-baseline gap-3 text-3xl font-bold uppercase leading-none tracking-tight md:text-4xl">
              On the shelf
              {!loadingList && products.length > 0 ? (
                <span className="font-mono text-sm font-medium tabular-nums text-base-content/40">
                  [{String(products.length).padStart(2, "0")}]
                </span>
              ) : null}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className={chipClass(!categoryFilter)} onClick={() => setCategory("")}>
              All
            </button>

            {categoryChipsLoading
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-9 w-20" aria-hidden />
                ))
              : categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={chipClass(categoryFilter === c)}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
          </div>
        </div>

        {loadingList ? (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i}>
                <div className="skeleton h-96 w-full" />
              </li>
            ))}
          </ul>
        ) : error ? (
          <PageError message="We couldn't load products. Please try again in a moment." />
        ) : products.length === 0 ? (
          <div className="border-2 border-dashed border-base-300 px-6 py-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-base-content/50">
            No products in this category yet.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <CatalogProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
export default HomePage;
