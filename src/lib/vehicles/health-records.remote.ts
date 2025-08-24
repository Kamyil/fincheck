import { form, query, command, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { eq, and, desc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { VehicleHealthRecord } from '$lib/server/db/schema';

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

export let addHealthRecord = form(async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	let vehicleId = data.get('vehicleId');
	let title = data.get('title');
	let serviceDateStr = data.get('serviceDate');

	if (typeof vehicleId !== 'string' || typeof title !== 'string' || !serviceDateStr) {
		return { success: false, error: 'Required fields missing' };
	}

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
		let serviceDate = new Date(serviceDateStr.toString());

		// Parse parts data (JSON string from form)
		let partsData = null;
		let partsString = data.get('partsReplaced');
		if (partsString && typeof partsString === 'string') {
			try {
				partsData = JSON.parse(partsString);
			} catch (parseErr) {
				console.error('Error parsing parts data:', parseErr);
				// Continue with null partsData
			}
		}

		// Parse costs
		let laborCost = data.get('laborCost');
		let totalCost = data.get('totalCost');
		let parsedLaborCost = laborCost && typeof laborCost === 'string' ? parseFloat(laborCost) : null;
		let parsedTotalCost = totalCost && typeof totalCost === 'string' ? parseFloat(totalCost) : null;

		await db.insert(schema.vehicleHealthRecord).values({
			id,
			vehicleId,
			userId: locals.user.id,
			title: title.trim(),
			description: data.get('description')?.toString()?.trim() || null,
			mileage: data.get('mileage') ? parseInt(data.get('mileage')!.toString(), 10) : null,
			serviceDate,
			serviceType: data.get('serviceType')?.toString()?.trim() || null,
			partsReplaced: partsData,
			laborCost: parsedLaborCost ? parsedLaborCost.toString() : null,
			totalCost: parsedTotalCost ? parsedTotalCost.toString() : null,
			receiptUrl: data.get('receiptUrl')?.toString()?.trim() || null,
			serviceProvider: data.get('serviceProvider')?.toString()?.trim() || null,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, id };
	} catch (err) {
		console.error('Error adding health record:', err);
		return { success: false, error: 'Failed to add health record' };
	}
});

export let updateHealthRecord = form(async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return { success: false, error: 'Authentication required' };
	}

	let id = data.get('id');
	let title = data.get('title');
	let serviceDateStr = data.get('serviceDate');

	if (typeof id !== 'string' || typeof title !== 'string' || !serviceDateStr) {
		return { success: false, error: 'Required fields missing' };
	}

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

		let serviceDate = new Date(serviceDateStr.toString());

		// Parse parts data (JSON string from form)
		let partsData = null;
		let partsString = data.get('partsReplaced');
		if (partsString && typeof partsString === 'string') {
			try {
				partsData = JSON.parse(partsString);
			} catch (parseErr) {
				console.error('Error parsing parts data:', parseErr);
			}
		}

		// Parse costs
		let laborCost = data.get('laborCost');
		let totalCost = data.get('totalCost');
		let parsedLaborCost = laborCost && typeof laborCost === 'string' ? parseFloat(laborCost) : null;
		let parsedTotalCost = totalCost && typeof totalCost === 'string' ? parseFloat(totalCost) : null;

		await db
			.update(schema.vehicleHealthRecord)
			.set({
				title: title.trim(),
				description: data.get('description')?.toString()?.trim() || null,
				mileage: data.get('mileage') ? parseInt(data.get('mileage')!.toString(), 10) : null,
				serviceDate,
				serviceType: data.get('serviceType')?.toString()?.trim() || null,
				partsReplaced: partsData,
				laborCost: parsedLaborCost ? parsedLaborCost.toString() : null,
				totalCost: parsedTotalCost ? parsedTotalCost.toString() : null,
				receiptUrl: data.get('receiptUrl')?.toString()?.trim() || null,
				serviceProvider: data.get('serviceProvider')?.toString()?.trim() || null,
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
