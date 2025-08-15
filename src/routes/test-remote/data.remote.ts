import { query } from '$app/server';

export const getData = query(async () => {
	return {
		message: 'Hello from remote function!',
		timestamp: new Date().toISOString()
	};
});
