import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (locals.user.role !== 'CLIENT') {
		throw redirect(302, '/mechanic');
	}

	return {
		user: locals.user
	};
};
