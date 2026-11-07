import { Link } from "react-router";

export function SentryErrorFallback() {
  return (
    <div className="mx-auto max-w-md border-2 border-base-300 bg-base-100 p-8 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-error">// crash</p>
      <p className="mt-3 text-base-content/80">Something went wrong. The error was reported.</p>

      <Link to="/" className="btn btn-primary btn-sm mt-6">
        Back to shop
      </Link>
    </div>
  );
}
