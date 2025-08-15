// Define form return types for login actions
export interface ActionData {
	message?: string;
}

// Import SvelteKit types from the app types
import type { Actions as SvelteKitActions } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export type Actions = SvelteKitActions;
export type PageServerLoad = ServerLoad;
