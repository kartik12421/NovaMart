export function PageHeader({ index, title, note }) {
  return (
    <header className="mb-8 border-b-2 border-base-300 pb-5 text-left">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
        {index}
      </p>
      <h1 className="mt-2 text-3xl font-bold uppercase leading-none tracking-tight md:text-4xl">
        {title}
      </h1>
      {note ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-base-content/60">{note}</p>
      ) : null}
    </header>
  );
}
