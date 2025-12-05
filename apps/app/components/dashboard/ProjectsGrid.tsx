type ProjectRow = {
  id: number;
  name: string;
  description: string;
  totalEntries: number;
  totalHours: string;
  totalExpenses: string;
};

type ProjectsGridProps = {
  rows: ProjectRow[];
  title: string;
};

export function ProjectsGrid({ rows, title }: ProjectsGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-900/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {project.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {project.description || 'Engin lýsing'}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">
                {project.totalEntries} færslur
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground/70">
                  Klukkustundir
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {project.totalHours}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground/70">
                  Útgjöld
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {project.totalExpenses}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
