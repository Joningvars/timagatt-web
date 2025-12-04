import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  expenses,
  organizationMembers,
  organizations,
  projects,
  timeEntries,
  users,
} from '@/lib/db/schema';

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const userId = user.id;
  const userEmail = user.emailAddresses[0]?.emailAddress ?? 'demo@timagatt.is';
  const userName = user.firstName ?? 'Demo User';
  const userImage = user.imageUrl;

  // 1. Ensure User Exists
  await db
    .insert(users)
    .values({
      id: userId,
      name: userName,
      email: userEmail,
      imageUrl: userImage,
    })
    .onDuplicateKeyUpdate({ set: { id: userId } });

  // 2. Check for existing organization
  const existingMemberships = await db
    .select()
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

  const existingMembership = existingMemberships[0];

  let organizationId: number;

  if (existingMembership) {
    organizationId = existingMembership.organizationId;
    // Optional: Clear existing data for this org to ensure clean demo state
    // await db.delete(timeEntries).where(eq(timeEntries.userId, userId));
    // await db.delete(expenses).where(eq(expenses.userId, userId));
    // await db.delete(projects).where(eq(projects.organizationId, organizationId));
  } else {
    // Create new Org
    const [newOrg] = await db.insert(organizations).values({
      name: `${userName}'s Workspace`,
      slug: `workspace-${userId.slice(0, 8)}`,
      plan: 'pro',
    }).$returningId();

    organizationId = newOrg.id;

    await db.insert(organizationMembers).values({
      userId: userId,
      organizationId: organizationId,
      role: 'owner',
    });
  }

  // 3. Seed Projects
  // Check if projects exist
  const existingProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.organizationId, organizationId));

  let projectIds: number[] = [];

  if (existingProjects.length === 0) {
    const insertedProjects = await db.insert(projects).values([
      {
        name: 'Mobile App Redesign',
        description: 'Complete UI overhaul for v2 launch.',
        color: 'bg-purple-500',
        organizationId,
      },
      {
        name: 'Client Portal',
        description: 'Secure self-serve experience for enterprise clients.',
        color: 'bg-blue-500',
        organizationId,
      },
      {
        name: 'Marketing Website',
        description: 'Refresh the landing page and blog.',
        color: 'bg-emerald-500',
        organizationId,
      },
    ]).$returningId();
    projectIds = insertedProjects.map(p => p.id);
  } else {
    projectIds = existingProjects.map(p => p.id);
  }

  // 4. Seed Time Entries (if none)
  const existingEntries = await db
    .select()
    .from(timeEntries)
    .where(eq(timeEntries.userId, userId))
    .limit(1);

  if (existingEntries.length === 0 && projectIds.length > 0) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    await db.insert(timeEntries).values([
      {
        userId,
        projectId: projectIds[0],
        description: 'Sprint planning + estimates',
        startTime: new Date(now.setHours(9, 0, 0, 0)),
        endTime: new Date(now.setHours(10, 30, 0, 0)),
        duration: 90 * 60,
      },
      {
        userId,
        projectId: projectIds[0],
        description: 'High-fi prototype updates',
        startTime: new Date(now.setHours(11, 0, 0, 0)),
        endTime: new Date(now.setHours(14, 30, 0, 0)),
        duration: 3.5 * 3600,
      },
      {
        userId,
        projectId: projectIds[1],
        description: 'API integration tests',
        startTime: new Date(yesterday.setHours(13, 0, 0, 0)),
        endTime: new Date(yesterday.setHours(16, 0, 0, 0)),
        duration: 3 * 3600,
      },
    ]);
  }

  // 5. Seed Expenses (if none)
   const existingExpenses = await db
     .select()
     .from(expenses)
     .where(eq(expenses.userId, userId))
     .limit(1);

  if (existingExpenses.length === 0 && projectIds.length > 0) {
    await db.insert(expenses).values([
      {
        userId,
        projectId: projectIds[0],
        description: 'Design assets bundle',
        amount: '49.00',
        date: new Date(),
      },
      {
        userId,
        projectId: projectIds[1],
        description: 'Server hosting (Monthly)',
        amount: '120.00',
        date: new Date(),
      },
    ]);
  }

  return redirect('/is/dashboard');
}
