import { form, query } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { validate } from '$lib/utils/validation';
import { updateUserProfileSchema } from './schemas';

export const getUserProfile = query(async () => {
	try {
		const users = await db.select().from(schema.user).limit(1);
		const user = users[0];

		if (!user) {
			error(404, 'User not found');
		}

		return {
			username: user.username,
			email: user.email,
			createdAt: user.createdAt
		};
	} catch (err) {
		console.error('Error fetching user profile:', err);
		error(500, 'Failed to fetch user profile');
	}
});

export const updateUserProfile = form(async (formData) => {
	const { data, errors } = validate(formData, updateUserProfileSchema);

	if (errors || !data) {
		console.error('Validation errors:', errors);
		return { success: false, errors };
	}

	const { email, username } = data;

	try {
		const existingUser = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.username, username))
			.limit(1);

		const users = await db.select().from(schema.user).limit(1);
		if (users.length === 0) {
			return { success: false, error: 'No users found to update' };
		}

		if (existingUser.length > 0 && existingUser[0].id !== users[0].id) {
			return { success: false, errors: { username: 'Username is already taken' } };
		}

		await db
			.update(schema.user)
			.set({
				username,
				email,
				updatedAt: new Date()
			})
			.where(eq(schema.user.id, users[0].id));

		await getUserProfile().refresh();

		return { success: true };
	} catch (err) {
		console.error('Error updating profile:', err);
		return { success: false, error: 'Failed to update profile' };
	}
});
