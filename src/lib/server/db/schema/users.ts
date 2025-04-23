import { pgTable, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('login').notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password_hash: text('password_hash').notNull(),
	created_at: timestamp('created_at').notNull(),
	updated_at: timestamp('updated_at'),
});


export type User = typeof users.$inferSelect;
