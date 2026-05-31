import { Logo } from "@/components/layout/logo";

export function PageLoading({
  title = "Memuat SignalWarga",
  description = "Menyiapkan data terbaru...",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl content-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <Logo />
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-32 animate-pulse rounded-full bg-emerald-100" />
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              {description}
            </p>
            <div className="mt-8 grid gap-3">
              <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
          <div className="grid gap-3">
            <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
            <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
            <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
          </div>
        </section>
      </div>
    </main>
  );
}
