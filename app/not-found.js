export const metadata = { title: "Not found · Earvin Gallardo" };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-night text-bone grid place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-[clamp(96px,22vw,180px)] font-bold leading-none tracking-[-0.05em] text-mango">
          404
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-2">
          This page doesn't exist
        </h1>
        <p className="text-mist mt-3">
          The link may be old, or the address has a typo. Everything on this
          site lives on one desktop.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            className="rounded-xl bg-bone text-night px-5 py-3 font-semibold hover:bg-mango"
          >
            Go to the desktop
          </a>
          <a
            href="/?open=notes"
            className="rounded-xl border border-white/15 px-5 py-3 font-semibold hover:border-mango"
          >
            Leave a note
          </a>
        </div>
      </div>
    </main>
  );
}
