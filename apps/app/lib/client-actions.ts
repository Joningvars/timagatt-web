'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { getUserOrganization } from '@/lib/dashboard/queries';

// --- Schemas ---

// NOTE: Schemas are defined here but not exported as objects to avoid "use server" serialization issues.
// Types are fine to export.

const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  vatNumber: z.string().max(10, 'Kennitala must be 10 digits max').optional(),
  bankAccount: z.string().regex(/^\d{4}-\d{2}-\d{6}$/, 'Invalid bank account format (XXXX-XX-XXXXXX)').optional().or(z.literal('')),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

// --- Actions ---

export async function getClients() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return [];
  }

  try {
    const result = await db.query.clients.findMany({
      where: eq(clients.organizationId, membership.organizationId),
      orderBy: (clients, { asc }) => [asc(clients.name)],
    });
    return result;
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return [];
  }
}

export async function createClient(data: CreateClientInput) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found' };
  }

  const validatedFields = createClientSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten() };
  }

  try {
    const result = await db.insert(clients).values({
      ...validatedFields.data,
      organizationId: membership.organizationId,
      userId: userId,
    });

    revalidatePath('/[locale]/export', 'page');
    // @ts-ignore
    return { success: true, id: result[0].insertId, client: { ...validatedFields.data, id: result[0].insertId } };
  } catch (error) {
    console.error('Failed to create client:', error);
    return { error: 'Failed to create client' };
  }
}

export async function updateClient(id: number, data: Partial<CreateClientInput>) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found' };
  }

  try {
    await db
      .update(clients)
      .set(data)
      .where(and(eq(clients.id, id), eq(clients.organizationId, membership.organizationId)));

    revalidatePath('/[locale]/export', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update client:', error);
    return { error: 'Failed to update client' };
  }
}
