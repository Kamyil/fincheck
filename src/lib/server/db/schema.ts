import { pgTable, integer, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CLIENT', 'MECHANIC']);

// The table in the database is actually called "users", not "user"
export const user = pgTable('users', {
	id: text('id').primaryKey(),
	age: integer('age'),
	// The column is actually called "login" in the database, not "username"
	username: text('login').notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: userRoleEnum('role').notNull().default('CLIENT'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at')
});

export const session = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
