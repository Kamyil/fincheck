import { form, query, command } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { fail, error } from '@sveltejs/kit';

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
export const updateUserProfile = form(async (data) => {
	const email = data.get('email');
	const username = data.get('username');

	// Validate data
	if (typeof email !== 'string' || typeof username !== 'string') {
		return fail(400, {
			message: 'Invalid form data',
			fields: { email, username },
			invalid: true
		});
	}

	if (username.length < 3) {
		return fail(400, {
			message: 'Username must be at least 3 characters',
			fields: { email, username },
			invalid: true
		});
	}

	try {
		// Check if username already exists (excluding current user)
		const existingUser = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.username, username))
			.limit(1);

		if (existingUser.length > 0 && existingUser[0].email !== email) {
			return fail(400, {
				message: 'Username already taken',
				fields: { email, username },
				invalid: true
			});
		}

		// For demo purposes, just update the first user
		const users = await db.select().from(schema.user).limit(1);
		if (users.length === 0) {
			return fail(404, {
				message: 'No users found to update',
				fields: { email, username },
				invalid: true
			});
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
		return fail(500, {
			message: 'Failed to update profile',
			fields: { email, username },
			invalid: true
		});
	}
});

// Example command for immediate actions
export const logoutUser = command(async () => {
	// This would typically handle logout logic
	// For example, invalidating a session

	return { success: true };
});
