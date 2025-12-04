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
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {project.name}
                </p>
                <p className="text-xs text-slate-500">
                  {project.description || 'Engin lýsing'}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                {project.totalEntries} færslur
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <div>
                <p className="text-[10px] uppercase text-slate-400">
                  Klukkustundir
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.totalHours}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400">Útgjöld</p>
                <p className="text-sm font-semibold text-slate-900">
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
