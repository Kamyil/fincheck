import { form, query, command, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { eq, and, desc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { VehicleHealthRecord } from '$lib/server/db/schema';
import { validate } from '$lib/utils/validation';
import { addHealthRecordSchema, updateHealthRecordSchema } from './health-records-schemas';

// This query will be used in the vehicle detail page to fetch health records
export let getHealthRecordsForVehicle = query('unchecked', async (vehicleId: string) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	if (!vehicleId) {
		return { success: false, error: 'Vehicle ID required' };
	}

	try {
		// First verify the user owns this vehicle
		let [vehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(and(eq(schema.vehicle.id, vehicleId), eq(schema.vehicle.userId, locals.user.id)));

		if (!vehicle) {
			return { success: false, error: 'Access denied' };
		}

		// Get health records for the vehicle, ordered by creation date (newest first)
		let records = await db
			.select()
			.from(schema.vehicleHealthRecord)
			.where(eq(schema.vehicleHealthRecord.vehicleId, vehicleId))
			.orderBy(desc(schema.vehicleHealthRecord.createdAt));

		return { success: true, records: records as VehicleHealthRecord[] };
	} catch (err) {
		console.error('Error fetching vehicle health records:', err);
		return { success: false, error: 'Failed to fetch health records' };
	}
});

export let addHealthRecord = form(async (formData) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	const { data, errors } = validate(formData, addHealthRecordSchema);

	if (errors || !data) {
		console.error('Validation errors:', errors);
		return { success: false, errors };
	}

	const {
		vehicleId,
		title,
		description,
		mileage,
		serviceDate,
		serviceType,
		partsReplaced,
		laborCost,
		totalCost,
		receiptUrl,
		serviceProvider
	} = data;

	try {
		// Verify the user owns this vehicle
		let [vehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(and(eq(schema.vehicle.id, vehicleId), eq(schema.vehicle.userId, locals.user.id)));

		if (!vehicle) {
			return { success: false, error: 'Access denied' };
		}

		let id = crypto.randomUUID();
		let parsedServiceDate = new Date(serviceDate);

		await db.insert(schema.vehicleHealthRecord).values({
			id,
			vehicleId,
			userId: locals.user.id,
			title,
			description: description || null,
			mileage: mileage || null,
			serviceDate: parsedServiceDate,
			serviceType: serviceType || null,
			partsReplaced: partsReplaced || null,
			laborCost: laborCost ? laborCost.toString() : null,
			totalCost: totalCost ? totalCost.toString() : null,
			receiptUrl: receiptUrl || null,
			serviceProvider: serviceProvider || null,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, id };
	} catch (err) {
		console.error('Error adding health record:', err);
		return { success: false, error: 'Failed to add health record' };
	}
});

export let updateHealthRecord = form(async (formData) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	const { data, errors } = validate(formData, updateHealthRecordSchema);

	if (errors || !data) {
		console.error('Validation errors:', errors);
		return { success: false, errors };
	}

	const {
		id,
		title,
		description,
		mileage,
		serviceDate,
		serviceType,
		partsReplaced,
		laborCost,
		totalCost,
		receiptUrl,
		serviceProvider
	} = data;

	try {
		// First get the existing record
		let [record] = await db
			.select()
			.from(schema.vehicleHealthRecord)
			.where(eq(schema.vehicleHealthRecord.id, id));

		if (!record) {
			return { success: false, error: 'Record not found' };
		}

		// Verify user owns the vehicle
		let [vehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(
				and(eq(schema.vehicle.id, record.vehicleId), eq(schema.vehicle.userId, locals.user.id))
			);

		if (!vehicle) {
			return { success: false, error: 'Access denied' };
		}

		let parsedServiceDate = new Date(serviceDate);

		await db
			.update(schema.vehicleHealthRecord)
			.set({
				title,
				description: description || null,
				mileage: mileage || null,
				serviceDate: parsedServiceDate,
				serviceType: serviceType || null,
				partsReplaced: partsReplaced || null,
				laborCost: laborCost ? laborCost.toString() : null,
				totalCost: totalCost ? totalCost.toString() : null,
				receiptUrl: receiptUrl || null,
				serviceProvider: serviceProvider || null,
				updatedAt: new Date()
			})
			.where(eq(schema.vehicleHealthRecord.id, id));

		return { success: true };
	} catch (err) {
		console.error('Error updating health record:', err);
		return { success: false, error: 'Failed to update health record' };
	}
});

export let deleteHealthRecord = command('unchecked', async (recordId: string) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	if (typeof recordId !== 'string') {
		return { success: false, error: 'Invalid record ID' };
	}

	try {
		console.log('Attempting to delete health record with ID:', recordId);

		// First get the record to be deleted
		let [record] = await db
			.select()
			.from(schema.vehicleHealthRecord)
			.where(eq(schema.vehicleHealthRecord.id, recordId));

		console.log('Found record:', record);

		if (!record) {
			console.log('Record not found for ID:', recordId);
			return { success: false, error: 'Record not found' };
		}

		// Verify user owns the vehicle
		let [vehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(
				and(eq(schema.vehicle.id, record.vehicleId), eq(schema.vehicle.userId, locals.user.id))
			);

		console.log('Found vehicle:', vehicle);

		if (!vehicle) {
			console.log('Access denied - user does not own vehicle');
			return { success: false, error: 'Access denied' };
		}

		console.log('Executing delete query...');
		let deleteResult = await db
			.delete(schema.vehicleHealthRecord)
			.where(eq(schema.vehicleHealthRecord.id, recordId));
		console.log('Delete result:', deleteResult);

		console.log('Successfully deleted health record');
		return { success: true };
	} catch (err) {
		console.error('Error deleting health record:', err);
		return { success: false, error: 'Failed to delete health record' };
	}
});
