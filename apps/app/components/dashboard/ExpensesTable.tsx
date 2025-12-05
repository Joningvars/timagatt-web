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
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm min-w-0 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">Verkefni</th>
              <th className="px-6 py-3">Lýsing</th>
              <th className="px-6 py-3">Notandi</th>
              <th className="px-6 py-3 text-right">Dagsetning</th>
              <th className="px-6 py-3 text-right">Upphæð</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {rows.map((expense) => (
              <tr key={expense.id} className="transition hover:bg-muted/30">
                <td className="px-6 py-4 font-semibold text-foreground">{expense.project}</td>
                <td className="px-6 py-4 text-muted-foreground">{expense.description}</td>
                <td className="px-6 py-4 text-muted-foreground">{expense.user}</td>
                <td className="px-6 py-4 text-right text-muted-foreground">{expense.date}</td>
                <td className="px-6 py-4 text-right font-semibold text-foreground">
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


