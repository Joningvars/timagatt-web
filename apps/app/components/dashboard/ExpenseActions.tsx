'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteExpense } from '@/lib/actions';
import { CreateExpenseDialog, ExpenseData } from '@/components/dashboard/CreateExpenseDialog';
import type { Project } from '@/lib/dashboard/data';

type ExpenseActionsProps = {
  expenseId: number;
  projects: Project[];
  initialData: ExpenseData;
};

export function ExpenseActions({ expenseId, projects, initialData }: ExpenseActionsProps) {
  const t = useTranslations('Dashboard.actions');
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  async function handleDelete() {
    const result = await deleteExpense(expenseId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Expense deleted');
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-muted-foreground transition hover:text-purple-600 cursor-pointer">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-900/20 dark:focus:text-red-300 cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateExpenseDialog
        projects={projects}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={initialData}
      />
    </>
  );
}

