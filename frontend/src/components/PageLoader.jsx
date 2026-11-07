const PageLoader = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-base-100">
      <div
        className="size-10 border-2 border-base-300 border-t-primary animate-spin"
        aria-hidden
      />
      <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-base-content/50">
        Loading
      </span>
    </div>
  );
};

export default PageLoader;
