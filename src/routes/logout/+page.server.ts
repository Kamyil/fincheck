import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	// Get the session ID from the cookie
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	// If there's a session token, invalidate the session in the database
	if (sessionToken) {
		try {
			// Get the session to get the ID (hashed token)
			const result = await auth.validateSessionToken(sessionToken);

			if (result.session) {
				// Invalidate the session in the database
				await auth.invalidateSession(result.session.id);
			}
		} catch (error) {
			console.error('Error invalidating session:', error);
		}
	}

	// Always delete the session cookie
	auth.deleteSessionTokenCookie(event);

	// Redirect to login page
	throw redirect(302, '/login');
};
