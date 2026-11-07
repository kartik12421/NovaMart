import { useAdminProductsPage } from "../hooks/useAdminProductsPage.js";
import { AdminProductsTableSkeleton } from "../components/LoadingSkeletons.jsx";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl.js";
import { Navigate } from "react-router";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { formatPrice } from "../utils/format.js";
import { AdminProductForm } from "../components/AdminProductForm.jsx";

const thClass =
  "font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-base-content/50";

function AdminProductsPage() {
  const {
    getToken,
    meData,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    products,
    isLoading,
    saveMutation,
    deleteMutation,
  } = useAdminProductsPage();

  if (meData && meData.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  function handleDeleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}" permanently?`)) return;

    deleteMutation.mutate(product.id);
  }

  return (
    <div className="text-left">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-base-300 pb-5">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-secondary">
            05 / Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold uppercase leading-none tracking-tight md:text-4xl">
            Products
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-base-content/55">
            Manage catalog (admin only)
          </p>
        </div>

        <button
          type="button"
          className="btn-brutal inline-flex items-center gap-2 border-2 border-primary bg-primary px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-primary-content hover:bg-transparent hover:text-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <PlusIcon className="size-4" aria-hidden />
          Add product
        </button>
      </div>

      {isLoading ? (
        <AdminProductsTableSkeleton />
      ) : (
        <div className="overflow-x-auto border-2 border-base-300 bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className={`w-24 ${thClass}`}>Preview</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Category</th>
                <th className={thClass}>Slug</th>
                <th className={thClass}>Price</th>
                <th className={thClass}>Active</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="align-middle">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden border-2 border-base-300 bg-base-200 sm:h-18 sm:w-18">
                      {p.imageUrl ? (
                        <img
                          src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.adminThumb)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-base-content/35">
                          <span className="font-mono text-[10px] uppercase">n/a</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="font-medium">{p.name}</td>
                  <td>
                    <span className="badge badge-ghost badge-sm font-mono uppercase tracking-widest">
                      {p.category ?? "-"}
                    </span>
                  </td>
                  <td className="font-mono text-sm opacity-80">{p.slug}</td>
                  <td className="font-mono text-sm font-bold tabular-nums">
                    {formatPrice(p.priceCents, p.currency)}
                  </td>
                  <td>
                    {p.active ? (
                      <span className="badge badge-success badge-sm font-mono uppercase tracking-widest">
                        yes
                      </span>
                    ) : (
                      <span className="badge badge-ghost badge-sm font-mono uppercase tracking-widest">
                        no
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs gap-1"
                        onClick={() => {
                          setEditing(p);
                          setModalOpen(true);
                        }}
                      >
                        <PencilIcon className="size-3" aria-hidden />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-xs gap-1 text-error hover:bg-error/10"
                        disabled={deleteMutation.isPending && deleteMutation.variables === p.id}
                        onClick={() => handleDeleteProduct(p)}
                      >
                        {deleteMutation.isPending && deleteMutation.variables === p.id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <Trash2Icon className="size-3" aria-hidden />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-lg border-2 border-base-300">
          <h3 className="font-mono text-sm font-bold uppercase tracking-[0.25em]">
            {editing ? "Edit product" : "New product"}
          </h3>

          <AdminProductForm
            key={editing?.id ?? "new"}
            initial={editing}
            saving={saveMutation.isPending}
            error={saveMutation.isError}
            getToken={getToken}
            onCancel={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSubmit={(body) => saveMutation.mutate({ body, id: editing?.id })}
          />
        </div>

        <button
          type="button"
          className="modal-backdrop bg-neutral/60"
          onClick={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </dialog>
    </div>
  );
}

export default AdminProductsPage;
