import { form, query, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { Vehicle } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export let getUserVehicles = query(async () => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		error(401, 'Authentication required');
	}

	try {
		let vehicles = await db
			.select()
			.from(schema.vehicle)
			.where(eq(schema.vehicle.userId, locals.user.id));

		return (vehicles as Vehicle[]) || ([] as Vehicle[]);
	} catch (err) {
		console.error('Error fetching vehicles:', err);
		// Return empty array instead of throwing error to handle gracefully in UI
		return [] as Vehicle[];
	}
});

export let addVehicle = form(async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	let make = data.get('make');
	let model = data.get('model');
	let year = data.get('year');

	if (typeof make !== 'string' || typeof model !== 'string' || !year) {
		return { success: false, error: 'Invalid vehicle data' };
	}

	let parsedYear = parseInt(year.toString(), 10);
	if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
		return { success: false, error: 'Invalid year' };
	}

	try {
		let id = crypto.randomUUID();

		await db.insert(schema.vehicle).values({
			id,
			userId: locals.user.id,
			make: make.trim(),
			model: model.trim(),
			year: parsedYear,
			vin: data.get('vin')?.toString()?.trim() || null,
			registration: data.get('registration')?.toString()?.trim() || null,
			color: data.get('color')?.toString()?.trim() || null,
			mileage: data.get('mileage') ? parseInt(data.get('mileage')!.toString(), 10) : null,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		await getUserVehicles().refresh();

		return { success: true, id };
	} catch (err) {
		console.error('Error adding vehicle:', err);
		return { success: false, error: 'Failed to add vehicle' };
	}
});

export let updateVehicle = form(async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	let id = data.get('id');
	let make = data.get('make');
	let model = data.get('model');
	let year = data.get('year');

	if (typeof id !== 'string' || typeof make !== 'string' || typeof model !== 'string' || !year) {
		return { success: false, error: 'Invalid vehicle data' };
	}

	let parsedYear = parseInt(year.toString(), 10);
	if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
		return { success: false, error: 'Invalid year' };
	}

	try {
		let [existingVehicle] = await db.select().from(schema.vehicle).where(eq(schema.vehicle.id, id));

		if (!existingVehicle) {
			return { success: false, error: 'Vehicle not found' };
		}

		if (existingVehicle.userId !== locals.user.id) {
			return { success: false, error: 'Access denied' };
		}

		await db
			.update(schema.vehicle)
			.set({
				make: make.trim(),
				model: model.trim(),
				year: parsedYear,
				vin: data.get('vin')?.toString()?.trim() || null,
				registration: data.get('registration')?.toString()?.trim() || null,
				color: data.get('color')?.toString()?.trim() || null,
				mileage: data.get('mileage') ? parseInt(data.get('mileage')!.toString(), 10) : null,
				updatedAt: new Date()
			})
			.where(eq(schema.vehicle.id, id));

		await getUserVehicles().refresh();

		return { success: true, id };
	} catch (err) {
		console.error('Error updating vehicle:', err);
		return { success: false, error: 'Failed to update vehicle' };
	}
});

export let deleteVehicle = form(async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	let id = data.get('id');

	if (typeof id !== 'string') {
		return { success: false, error: 'Invalid vehicle ID' };
	}

	try {
		let [existingVehicle] = await db.select().from(schema.vehicle).where(eq(schema.vehicle.id, id));

		if (!existingVehicle) {
			return { success: false, error: 'Vehicle not found' };
		}

		if (existingVehicle.userId !== locals.user.id) {
			return { success: false, error: 'Access denied' };
		}

		await db.delete(schema.vehicle).where(eq(schema.vehicle.id, id));

		await getUserVehicles().refresh();

		return { success: true };
	} catch (err) {
		console.error('Error deleting vehicle:', err);
		return { success: false, error: 'Failed to delete vehicle' };
	}
});
