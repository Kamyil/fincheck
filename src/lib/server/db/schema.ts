import {
	pgTable,
	integer,
	text,
	timestamp,
	varchar,
	pgEnum,
	jsonb,
	numeric
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CLIENT', 'MECHANIC']);

export const partStatusEnum = pgEnum('part_status', [
	'CHANGED',
	'REPAIRED',
	'REPLACED',
	'ADJUSTED',
	'CLEANED',
	'INSPECTED'
]);

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

export const vehicle = pgTable('vehicles', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	make: varchar('make', { length: 100 }).notNull(),
	model: varchar('model', { length: 100 }).notNull(),
	year: integer('year').notNull(),
	vin: varchar('vin', { length: 17 }),
	registration: varchar('registration', { length: 20 }),
	color: varchar('color', { length: 50 }),
	mileage: integer('mileage'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at')
});

export type Vehicle = typeof vehicle.$inferSelect;

export const vehicleHealthRecord = pgTable('vehicle_health_records', {
	id: text('id').primaryKey(),
	vehicleId: text('vehicle_id')
		.notNull()
		.references(() => vehicle.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: varchar('title', { length: 200 }).notNull(),
	description: text('description'),
	mileage: integer('mileage'),
	serviceDate: timestamp('service_date').notNull(),
	serviceType: varchar('service_type', { length: 100 }),
	partsReplaced: jsonb('parts_replaced'),
	laborCost: numeric('labor_cost', { precision: 10, scale: 2 }),
	totalCost: numeric('total_cost', { precision: 10, scale: 2 }),
	receiptUrl: text('receipt_url'),
	serviceProvider: varchar('service_provider', { length: 200 }),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at')
});

export type VehicleHealthRecord = typeof vehicleHealthRecord.$inferSelect;
