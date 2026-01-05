import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

function createDb() {
	if (building) {
		return null as unknown as ReturnType<typeof drizzle>;
	}
	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
	const client = postgres(env.DATABASE_URL);
	return drizzle(client, { schema });
}

export const db = createDb();
