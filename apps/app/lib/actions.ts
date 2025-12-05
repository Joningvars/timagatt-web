'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projects, timeEntries, users, organizations, expenses } from '@/lib/db/schema';
import { getUserOrganization, searchProjects, searchTimeEntries, searchExpenses } from '@/lib/dashboard/queries';

// --- Schemas ---

const createJobSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
});

const updateJobSchema = createJobSchema.partial().extend({
  id: z.number(),
});

const createTimeEntrySchema = z.object({
  projectId: z.number(),
  description: z.string().optional(),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  duration: z.number().optional(), // in seconds
});

const updateTimeEntrySchema = createTimeEntrySchema.partial().extend({
  id: z.number(),
});

const createExpenseSchema = z.object({
  projectId: z.number(),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().transform((val) => parseFloat(val)),
  date: z.string().transform((str) => new Date(str)),
});

const updateExpenseSchema = createExpenseSchema.partial().extend({
  id: z.number(),
});

// --- Actions ---

// JOB (PROJECT) ACTIONS

export async function createJob(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found' };
  }

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    color: formData.get('color'),
  };

  const validatedFields = createJobSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten() };
  }

  try {
    await db.insert(projects).values({
      ...validatedFields.data,
      organizationId: membership.organizationId,
      userId: userId, // Optional, depending on if it's personal or org-wide
    });

    revalidatePath('/[locale]/verkefni');
    revalidatePath('/[locale]/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to create job:', error);
    return { error: 'Failed to create job' };
  }
}

export async function updateJob(id: number, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found' };
  }

  const rawData = {
    id,
    name: formData.get('name'),
    description: formData.get('description'),
    color: formData.get('color'),
  };

  const validatedFields = updateJobSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten() };
  }

  try {
    const result = await db
      .update(projects)
      .set(validatedFields.data)
      .where(and(eq(projects.id, id), eq(projects.organizationId, membership.organizationId)));
      
    // @ts-ignore - Accessing result header depends on driver but usually available
    if (result && result[0] && result[0].affectedRows === 0) {
        return { error: 'Job not found or unauthorized' };
    }

    revalidatePath('/[locale]/verkefni');
    return { success: true };
  } catch (error) {
    console.error('Failed to update job:', error);
    return { error: 'Failed to update job' };
  }
}

export async function deleteJob(id: number) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found' };
  }

  try {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.organizationId, membership.organizationId)));
      
    // @ts-ignore
    if (result && result[0] && result[0].affectedRows === 0) {
         return { error: 'Job not found or unauthorized' };
    }

    revalidatePath('/[locale]/verkefni');
    revalidatePath('/[locale]/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete job:', error);
    return { error: 'Failed to delete job' };
  }
}

// TIME ENTRY ACTIONS

export async function createTimeEntry(data: z.infer<typeof createTimeEntrySchema>) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Validate project ownership
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, data.projectId),
    with: {
        organization: true
    }
  });

  if (!project) {
      return { error: "Project not found" }
  }
  
  const membership = await getUserOrganization(userId);

  if (!membership || membership.organizationId !== project.organizationId) {
      return { error: "Unauthorized for this project" }
  }

  let duration = data.duration;
  if (!duration && data.endTime) {
    duration = Math.floor((data.endTime.getTime() - data.startTime.getTime()) / 1000);
  }

  if (duration && duration < 0) {
    return { error: "End time cannot be before start time" };
  }

  try {
    await db.insert(timeEntries).values({
      userId: userId,
      projectId: data.projectId,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: duration,
    });

    revalidatePath('/[locale]/timaskraningar');
    revalidatePath('/[locale]/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to create time entry:', error);
    return { error: 'Failed to create time entry' };
  }
}

export async function updateTimeEntry(id: number, data: Partial<z.infer<typeof createTimeEntrySchema>>) {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }
    
    const membership = await getUserOrganization(userId);
    if (!membership) {
      return { error: 'No organization found' };
    }

    let duration = data.duration;
    if (data.startTime && data.endTime) {
        duration = Math.floor((data.endTime.getTime() - data.startTime.getTime()) / 1000);
    }

    if (duration && duration < 0) {
        return { error: "End time cannot be before start time" };
    }
    
    const updateData = {
        ...data,
        duration: duration !== undefined ? duration : undefined
    }

    try {
        // Check permission via project
        const entry = await db.query.timeEntries.findFirst({
            where: eq(timeEntries.id, id),
            with: {
                project: true
            }
        });

        if (!entry) return { error: 'Entry not found' };
        
        if (entry.project.organizationId !== membership.organizationId) {
             return { error: 'Unauthorized' };
        }

        await db.update(timeEntries)
            .set(updateData)
            .where(eq(timeEntries.id, id));

        revalidatePath('/[locale]/timaskraningar');
        revalidatePath('/[locale]/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to update time entry:', error);
        return { error: 'Failed to update time entry' };
    }
}

export async function deleteTimeEntry(id: number) {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const membership = await getUserOrganization(userId);
    if (!membership) {
      return { error: 'No organization found' };
    }

    try {
        // Check permission via project
        const entry = await db.query.timeEntries.findFirst({
            where: eq(timeEntries.id, id),
            with: {
                project: true
            }
        });

        if (!entry) return { error: 'Entry not found' };
        
        if (entry.project.organizationId !== membership.organizationId) {
             return { error: 'Unauthorized' };
        }

        await db.delete(timeEntries)
            .where(eq(timeEntries.id, id));

        revalidatePath('/[locale]/timaskraningar');
        revalidatePath('/[locale]/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete time entry:', error);
        return { error: 'Failed to delete time entry' };
    }
}

// EXPENSE ACTIONS

export async function createExpense(data: z.infer<typeof createExpenseSchema>) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, data.projectId),
    with: {
        organization: true
    }
  });

  if (!project) {
      return { error: "Project not found" }
  }
  
  const membership = await getUserOrganization(userId);

  if (!membership || membership.organizationId !== project.organizationId) {
      return { error: "Unauthorized for this project" }
  }

  try {
    await db.insert(expenses).values({
      userId: userId,
      projectId: data.projectId,
      description: data.description,
      amount: String(data.amount),
      date: data.date,
    });

    revalidatePath('/[locale]/utgjold');
    revalidatePath('/[locale]/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to create expense:', error);
    return { error: 'Failed to create expense' };
  }
}

export async function updateExpense(id: number, data: Partial<z.infer<typeof createExpenseSchema>>) {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const membership = await getUserOrganization(userId);
    if (!membership) {
      return { error: 'No organization found' };
    }

    try {
        // Check permission via project
        const expense = await db.query.expenses.findFirst({
            where: eq(expenses.id, id),
            with: {
                project: true
            }
        });

        if (!expense) return { error: 'Expense not found' };
        
        if (expense.project.organizationId !== membership.organizationId) {
             return { error: 'Unauthorized' };
        }

        await db.update(expenses)
            .set({
                ...data,
                amount: data.amount !== undefined ? String(data.amount) : undefined
            })
            .where(eq(expenses.id, id));

        revalidatePath('/[locale]/utgjold');
        revalidatePath('/[locale]/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to update expense:', error);
        return { error: 'Failed to update expense' };
    }
}

export async function deleteExpense(id: number) {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const membership = await getUserOrganization(userId);
    if (!membership) {
      return { error: 'No organization found' };
    }

    try {
        // Check permission via project
        const expense = await db.query.expenses.findFirst({
            where: eq(expenses.id, id),
            with: {
                project: true
            }
        });

        if (!expense) return { error: 'Expense not found' };
        
        if (expense.project.organizationId !== membership.organizationId) {
             return { error: 'Unauthorized' };
        }

        await db.delete(expenses)
            .where(eq(expenses.id, id));

        revalidatePath('/[locale]/utgjold');
        revalidatePath('/[locale]/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete expense:', error);
        return { error: 'Failed to delete expense' };
    }
}

// SEARCH ACTION

export async function performGlobalSearch(query: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized', projects: [], entries: [], expenses: [] };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found', projects: [], entries: [], expenses: [] };
  }

  if (!query || query.length < 2) {
    return { projects: [], entries: [], expenses: [] };
  }

  const [projects, entries, expenses] = await Promise.all([
    searchProjects(membership.organizationId, query),
    searchTimeEntries(membership.organizationId, query),
    searchExpenses(membership.organizationId, query),
  ]);

  return { projects, entries, expenses };
}

export async function updateUserTheme(theme: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {
    // First check if user exists in our DB (they should if they are logged in and have an org, but maybe not synced yet)
    // We'll do an update. If it fails or affects 0 rows, we might need to handle it, but usually user row exists.
    await db
      .update(users)
      .set({ theme })
      .where(eq(users.id, userId));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user theme:', error);
    return { error: 'Failed to update user theme' };
  }
}
