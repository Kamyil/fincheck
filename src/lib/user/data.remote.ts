import { form, query, command } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { validate } from '$lib/utils/validation';
import { updateUserProfileSchema } from './schemas';

// Get user profile
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

// Update user profile with form
export const updateUserProfile = form(async (formData) => {
	const { data, errors } = validate(formData, updateUserProfileSchema);

	if (errors || !data) {
		console.error('Validation errors:', errors);
		return { success: false, errors };
	}

	const { email, username } = data;

	try {
		// Check if username already exists (excluding current user)
		const existingUser = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.username, username))
			.limit(1);

		// For demo purposes, get first user for comparison
		const users = await db.select().from(schema.user).limit(1);
		if (users.length === 0) {
			return { success: false, error: 'No users found to update' };
		}

		if (existingUser.length > 0 && existingUser[0].id !== users[0].id) {
			return { success: false, errors: { username: 'Nazwa użytkownika jest już zajęta' } };
		}

		// Update user
		await db
			.update(schema.user)
			.set({
				username,
				email,
				updatedAt: new Date()
			})
			.where(eq(schema.user.id, users[0].id));

		// Refresh the query to get updated data
		await getUserProfile().refresh();

		return { success: true };
	} catch (err) {
		console.error('Error updating profile:', err);
		return { success: false, error: 'Failed to update profile' };
	}
});

// Example command for immediate actions
export const logoutUser = command(async () => {
	// This would typically handle logout logic
	// For example, invalidating a session

	return { success: true };
});
