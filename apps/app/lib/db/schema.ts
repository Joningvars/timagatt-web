import {
  mysqlTable,
  serial,
  text,
  varchar,
  timestamp,
  int,
  boolean,
  decimal,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = mysqlEnum("role", ["owner", "admin", "member"]);

// Users
export const users = mysqlTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(), // Clerk ID
  name: varchar("name", { length: 191 }),
  email: varchar("email", { length: 191 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(organizationMembers),
  projects: many(projects), // Personal projects
  timeEntries: many(timeEntries),
  expenses: many(expenses),
}));

// Organizations
export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).unique().notNull(),
  imageUrl: text("image_url"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
  plan: varchar("plan", { length: 191 }).default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  projects: many(projects),
}));

// Organization Members
export const organizationMembers = mysqlTable("organization_members", {
  id: serial("id").primaryKey(),
  organizationId: int("organization_id")
    .notNull()
    .references(() => organizations.id),
  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => users.id),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

// Projects
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 64 }),
  organizationId: int("organization_id").references(() => organizations.id),
  userId: varchar("user_id", { length: 191 }).references(() => users.id), // For personal projects
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  timeEntries: many(timeEntries),
  expenses: many(expenses),
}));

// Time Entries
export const timeEntries = mysqlTable("time_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => users.id),
  projectId: int("project_id")
    .notNull()
    .references(() => projects.id),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: int("duration"), // in seconds (optional, can be calculated)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
}));

// Expenses
export const expenses = mysqlTable("expenses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => users.id),
  projectId: int("project_id")
    .notNull()
    .references(() => projects.id),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [expenses.projectId],
    references: [projects.id],
  }),
}));

