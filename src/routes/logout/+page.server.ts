import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (sessionToken) {
		try {
			const result = await auth.validateSessionToken(sessionToken);
			if (result.session) {
				await auth.invalidateSession(result.session.id);
			}
		} catch (error) {
			console.error('Error invalidating session:', error);
		}
	}

	auth.deleteSessionTokenCookie(event);
	throw redirect(302, '/login');
};
