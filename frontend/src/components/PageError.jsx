import { Link } from "react-router";

export function PageError({ message, action }) {
  return (
    <div
      className="border-2 border-base-300 bg-base-100 px-6 py-12 text-center"
      role="alert"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-error">// error</p>
      <p className="mt-3 text-base-content/75">{message}</p>
      {action ? (
        <Link
          to={action.to}
          className="mt-5 inline-flex border-2 border-base-300 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-base-content transition-colors hover:border-primary hover:bg-primary hover:text-primary-content"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
