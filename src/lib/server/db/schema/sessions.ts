import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	user_id: text('user_id').notNull().references(() => users.id),
	expires_at: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof sessions.$inferSelect;
