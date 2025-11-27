export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center shadow-sm transition-all hover:shadow-md dark:bg-card">
          <div className="mb-2 font-mono text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
            10k+
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Active Educators
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center shadow-sm transition-all hover:shadow-md dark:bg-card">
          <div className="mb-2 font-mono text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
            50k+
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Papers Generated
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center shadow-sm transition-all hover:shadow-md dark:bg-card sm:col-span-2 lg:col-span-1">
          <div className="mb-2 font-mono text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
            92%
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Efficiency Gain
          </p>
        </div>
      </div>
    </section>
  );
}
