import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { HTTP_STATUS_CODES } from '$lib/utils/HTTP_STATUS_CODES';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
	if (event.locals.user) {
		throw redirect(302, '/profile');
	}
	return {};
};

export const actions: Actions = {
	login: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Invalid password (min 6, max 255 characters)'
			});
		}

		const results = await db.select().from(table.user).where(eq(table.user.username, username));
		const existingUser = results.at(0);

		if (!existingUser) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Incorrect username or password'
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		throw redirect(302, '/profile');
	},

	register: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Invalid password (min 6, max 255 characters)'
			});
		}

		const existingUsers = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));
		if (existingUsers.length > 0) {
			return fail(HTTP_STATUS_CODES.BAD_REQUEST, {
				message: 'Username already taken'
			});
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({
				id: userId,
				username,
				email: `${username}@app.local`,
				passwordHash,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			return fail(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
				message: 'An error occurred during registration'
			});
		}

		throw redirect(302, '/profile');
	}
};

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
