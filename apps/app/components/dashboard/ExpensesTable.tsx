'use client';

import { useState, useMemo, ReactNode } from 'react';
import Image from 'next/image';
import { Filter, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type ExpenseRow = {
  id: number;
  description: string;
  amount: string;
  date: string;
  project: string;
  user: string;
  userAvatar: string;
};

type ExpensesTableProps = {
  rows: ExpenseRow[];
  title: string;
  actions?: ReactNode;
};

export function ExpensesTable({ rows, title, actions }: ExpensesTableProps) {
  const t = useTranslations('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const uniqueProjects = useMemo(() => {
    return Array.from(new Set(rows.map((e) => e.project))).sort();
  }, [rows]);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(rows.map((e) => e.user))).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        searchQuery === '' ||
        row.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.user.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject =
        selectedProjects.size === 0 || selectedProjects.has(row.project);
      const matchesUser =
        selectedUsers.size === 0 || selectedUsers.has(row.user);

      return matchesSearch && matchesProject && matchesUser;
    });
  }, [rows, searchQuery, selectedProjects, selectedUsers]);

  const toggleFilter = (
    set: Set<string>,
    setState: (s: Set<string>) => void,
    value: string
  ) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setState(newSet);
  };

  const clearFilters = () => {
    setSelectedProjects(new Set());
    setSelectedUsers(new Set());
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedProjects.size > 0 || selectedUsers.size > 0 || searchQuery !== '';

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm min-w-0 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('table.filterPlaceholder')}
              className="h-8 bg-muted/50 pl-8 pr-3 text-xs border-input focus:bg-background"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 items-center gap-2 rounded-lg border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <Filter className="h-3.5 w-3.5" />
                {t('table.filter.button')}
                {(selectedProjects.size > 0 || selectedUsers.size > 0) && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                    {selectedProjects.size + selectedUsers.size}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('table.filter.button')}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  {t('table.filter.byJob')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-[200px] overflow-y-auto">
                  {uniqueProjects.map((project) => (
                    <DropdownMenuCheckboxItem
                      key={project}
                      checked={selectedProjects.has(project)}
                      onCheckedChange={() =>
                        toggleFilter(
                          selectedProjects,
                          setSelectedProjects,
                          project
                        )
                      }
                      className="cursor-pointer"
                    >
                      {project}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  {t('table.filter.byUser')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-[200px] overflow-y-auto">
                  {uniqueUsers.map((user) => (
                    <DropdownMenuCheckboxItem
                      key={user}
                      checked={selectedUsers.has(user)}
                      onCheckedChange={() =>
                        toggleFilter(selectedUsers, setSelectedUsers, user)
                      }
                      className="cursor-pointer"
                    >
                      {user}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clearFilters}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
            {actions}
          </DropdownMenu>
        </div>
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
            {filteredRows.length > 0 ? (
              filteredRows.map((expense) => (
                <tr key={expense.id} className="transition hover:bg-muted/30">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {expense.project}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleFilter(
                          selectedUsers,
                          setSelectedUsers,
                          expense.user
                        )
                      }
                      className="flex items-center gap-2 transition hover:opacity-75"
                    >
                      <Image
                        src={expense.userAvatar}
                        alt={expense.user}
                        width={24}
                        height={24}
                        className="rounded-full border border-border cursor-pointer"
                      />
                      <span className="text-xs font-medium text-muted-foreground cursor-pointer hover:underline">
                        {expense.user}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    {expense.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-xs text-muted-foreground"
                >
                  No expenses found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
