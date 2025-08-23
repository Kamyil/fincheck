import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

export const load = async ({ params, locals }: { params: any; locals: any }) => {
	if (!locals.user) {
		error(401, 'Authentication required');
	}

	const vehicleId = params.id;
	if (!vehicleId) {
		error(400, 'Vehicle ID required');
	}

	try {
		const [vehicle] = await db
			.select()
			.from(schema.vehicle)
			.where(eq(schema.vehicle.id, vehicleId));

		if (!vehicle) {
			error(404, 'Vehicle not found');
		}

		if (vehicle.userId !== locals.user.id) {
			error(403, 'Access denied - this vehicle does not belong to you');
		}

		return {
			vehicle
		};
	} catch (err) {
		console.error('Error loading vehicle:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		error(500, 'Failed to load vehicle');
	}
};
