import { form, query, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { Vehicle } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { validate } from '$lib/utils/validation';
import { addVehicleSchema, updateVehicleSchema, deleteVehicleSchema } from './schemas';

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

export let addVehicle = form(async (formData) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	// Validate form data
	const { data, errors } = validate(formData, addVehicleSchema);

	if (errors) {
		return {
			success: false,
			errors
		};
	}

	try {
		let id = crypto.randomUUID();

		await db.insert(schema.vehicle).values({
			id,
			userId: locals.user.id,
			make: data!.make,
			model: data!.model,
			year: data!.year,
			vin: data!.vin || null,
			registration: data!.registration || null,
			color: data!.color || null,
			mileage: data!.mileage || null,
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

export let updateVehicle = form(async (formData) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	// Validate form data
	const { data, errors } = validate(formData, updateVehicleSchema);

	if (errors) {
		return {
			success: false,
			errors
		};
	}

	try {
		let [existingVehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(eq(schema.vehicle.id, data!.id));

		if (!existingVehicle) {
			return { success: false, error: 'Vehicle not found' };
		}

		if (existingVehicle.userId !== locals.user.id) {
			return { success: false, error: 'Access denied' };
		}

		await db
			.update(schema.vehicle)
			.set({
				make: data!.make,
				model: data!.model,
				year: data!.year,
				vin: data!.vin || null,
				registration: data!.registration || null,
				color: data!.color || null,
				mileage: data!.mileage || null,
				updatedAt: new Date()
			})
			.where(eq(schema.vehicle.id, data!.id));

		await getUserVehicles().refresh();

		return { success: true, id: data!.id };
	} catch (err) {
		console.error('Error updating vehicle:', err);
		return { success: false, error: 'Failed to update vehicle' };
	}
});

export let deleteVehicle = form(async (formData) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	// Validate form data
	const { data, errors } = validate(formData, deleteVehicleSchema);

	if (errors || !data) {
		console.log('Validation errors:', errors);
		return {
			success: false,
			errors
		};
	}

	try {
		let [existingVehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(eq(schema.vehicle.id, data!.id));

		if (!existingVehicle) {
			return { success: false, error: 'Vehicle not found' };
		}

		if (existingVehicle.userId !== locals.user.id) {
			return { success: false, error: 'Access denied' };
		}

		await db.delete(schema.vehicle).where(eq(schema.vehicle.id, data!.id));

		await getUserVehicles().refresh();

		return { success: true };
	} catch (err) {
		console.error('Error deleting vehicle:', err);
		return { success: false, error: 'Failed to delete vehicle' };
	}
});
