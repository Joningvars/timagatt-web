type ExpenseRow = {
  id: number;
  description: string;
  amount: string;
  date: string;
  project: string;
  user: string;
};

type ExpensesTableProps = {
  rows: ExpenseRow[];
  title: string;
};

export function ExpensesTable({ rows, title }: ExpensesTableProps) {
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
              <th className="px-6 py-3">Lýsing</th>
              <th className="px-6 py-3">Notandi</th>
              <th className="px-6 py-3 text-right">Dagsetning</th>
              <th className="px-6 py-3 text-right">Upphæð</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rows.map((expense) => (
              <tr key={expense.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-4 font-semibold text-slate-900">{expense.project}</td>
                <td className="px-6 py-4 text-slate-600">{expense.description}</td>
                <td className="px-6 py-4 text-slate-600">{expense.user}</td>
                <td className="px-6 py-4 text-right text-slate-500">{expense.date}</td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">
                  {expense.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


