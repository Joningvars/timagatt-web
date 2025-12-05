type InvoiceRow = {
  id: number;
  project: string;
  amount: string;
  status: "sent" | "draft";
  updatedAt: string;
};

type InvoicesTableProps = {
  rows: InvoiceRow[];
  title: string;
};

const STATUS_STYLES: Record<InvoiceRow["status"], string> = {
  sent: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  draft: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700",
};

export function InvoicesTable({ rows, title }: InvoicesTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm min-w-0 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">Verkefni</th>
              <th className="px-6 py-3">Upphæð</th>
              <th className="px-6 py-3">Staða</th>
              <th className="px-6 py-3 text-right">Uppfært</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {rows.map((invoice) => (
              <tr key={invoice.id} className="transition hover:bg-muted/30">
                <td className="px-6 py-4 font-semibold text-foreground">{invoice.project}</td>
                <td className="px-6 py-4 text-muted-foreground">{invoice.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLES[invoice.status]}`}
                  >
                    {invoice.status === "sent" ? "Sent" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">{invoice.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


