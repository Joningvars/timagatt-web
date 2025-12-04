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
  sent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
};

export function InvoicesTable({ rows, title }: InvoicesTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm min-w-0">
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">Verkefni</th>
              <th className="px-6 py-3">Upphæð</th>
              <th className="px-6 py-3">Staða</th>
              <th className="px-6 py-3 text-right">Uppfært</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rows.map((invoice) => (
              <tr key={invoice.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-4 font-semibold text-slate-900">{invoice.project}</td>
                <td className="px-6 py-4 text-slate-600">{invoice.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLES[invoice.status]}`}
                  >
                    {invoice.status === "sent" ? "Sent" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-500">{invoice.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


