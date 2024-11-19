import { createId } from '@paralleldrive/cuid2';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const role = pgTable('role', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  roleName: varchar('role_name').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: varchar('created_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  updatedBy: varchar('updated_by'),
});

export const users = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  mobile: varchar('mobile').notNull(),
  role: varchar('role'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: varchar('created_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  updatedBy: varchar('updated_by'),
});

export const document = pgTable('document', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar('title').notNull(),
  fileName: varchar('filename').notNull(),
  filePath: varchar('filepath').unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: varchar('created_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  updatedBy: varchar('updated_by'),
});
