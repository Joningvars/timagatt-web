'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Filter, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import type { RecentEntry } from '@/lib/dashboard/data';
import { Input } from '@/components/ui/input';
import { EntryActions } from '@/components/dashboard/EntryActions';
import { ReactNode } from 'react';
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

type DateFilter = 'all' | 'week' | 'month' | 'year';

type EntriesTableProps = {
  entries: RecentEntry[];
  title?: string;
  filterPlaceholder?: string;
  actions?: ReactNode;
};

export function EntriesTable({
  entries,
  title,
  filterPlaceholder,
  actions,
}: EntriesTableProps) {
  const t = useTranslations('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const uniqueProjects = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.project))).sort();
  }, [entries]);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.user.name))).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    let dateRange: { start: Date; end: Date } | null = null;

    if (dateFilter === 'week') {
      dateRange = {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    } else if (dateFilter === 'month') {
      dateRange = {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    } else if (dateFilter === 'year') {
      dateRange = {
        start: startOfYear(now),
        end: endOfYear(now),
      };
    }

    return entries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.user.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject =
        selectedProjects.size === 0 || selectedProjects.has(entry.project);
      const matchesUser =
        selectedUsers.size === 0 || selectedUsers.has(entry.user.name);

      let matchesDate = true;
      if (dateRange && entry.rawDate) {
        matchesDate = isWithinInterval(parseISO(entry.rawDate), dateRange);
      }

      return matchesSearch && matchesProject && matchesUser && matchesDate;
    });
  }, [entries, searchQuery, selectedProjects, selectedUsers, dateFilter]);

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
    setDateFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedProjects.size > 0 ||
    selectedUsers.size > 0 ||
    dateFilter !== 'all' ||
    searchQuery !== '';

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm min-w-0">
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-900">
          {title ?? t('table.title')}
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={filterPlaceholder ?? t('table.filterPlaceholder')}
              className="h-8 bg-slate-50 pl-8 pr-3 text-xs"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer">
                <Filter className="h-3.5 w-3.5" />
                {t('table.filter.button')}
                {(selectedProjects.size > 0 ||
                  selectedUsers.size > 0 ||
                  dateFilter !== 'all') && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600">
                    {selectedProjects.size +
                      selectedUsers.size +
                      (dateFilter !== 'all' ? 1 : 0)}
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

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  {t('table.filter.byDate')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={dateFilter}
                    onValueChange={(value) =>
                      setDateFilter(value as DateFilter)
                    }
                  >
                    <DropdownMenuRadioItem
                      value="all"
                      className="cursor-pointer"
                    >
                      {t('table.filter.allTime')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="week"
                      className="cursor-pointer"
                    >
                      {t('table.filter.thisWeek')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="month"
                      className="cursor-pointer"
                    >
                      {t('table.filter.thisMonth')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="year"
                      className="cursor-pointer"
                    >
                      {t('table.filter.thisYear')}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
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
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">{t('table.columns.clientProject')}</th>
              <th className="px-6 py-3">{t('table.columns.description')}</th>
              <th className="px-6 py-3">{t('table.columns.user')}</th>
              <th className="px-6 py-3">{t('table.columns.date')}</th>
              <th className="px-6 py-3">{t('table.columns.duration')}</th>
              <th className="px-6 py-3">{t('table.columns.amount')}</th>
              <th className="px-6 py-3">{t('table.columns.status')}</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="group transition hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${entry.color}`}
                      >
                        {entry.initials}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            selectedProjects,
                            setSelectedProjects,
                            entry.project
                          )
                        }
                        className="text-left transition hover:opacity-75"
                      >
                        <p className="text-xs font-bold text-slate-900 cursor-pointer hover:underline">
                          {entry.client}
                        </p>
                        <p className="text-[10px] text-slate-500 cursor-pointer hover:underline">
                          {entry.project}
                        </p>
                      </button>
                    </div>
                  </td>
                  <td className="max-w-[220px] px-6 py-4">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {entry.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleFilter(
                          selectedUsers,
                          setSelectedUsers,
                          entry.user.name
                        )
                      }
                      className="flex items-center gap-2 transition hover:opacity-75"
                    >
                      <Image
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        width={24}
                        height={24}
                        className="rounded-full border border-slate-100 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-700 cursor-pointer hover:underline">
                        {entry.user.name}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-600">
                      {entry.date}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-900">
                      {entry.duration}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-600">
                      {entry.amount}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${entry.status.color}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${entry.status.dot}`}
                      />
                      {t(entry.status.labelKey)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <EntryActions entryId={entry.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-xs text-slate-500"
                >
                  No entries found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
