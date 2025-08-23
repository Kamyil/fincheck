import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	// If user is logged in, redirect to appropriate dashboard
	if (locals.user) {
		if (locals.user.role === 'MECHANIC') {
			throw redirect(302, '/mechanic');
		} else {
			throw redirect(302, '/client');
		}
	}

	// If not logged in, show the homepage
	return {};
};
