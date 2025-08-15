import { db } from './src/lib/server/db';
import { users } from './src/lib/server/db/schema/users';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';

async function createTestUser() {
	try {
		const passwordHash = await hash('testuser123', {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Delete existing user with same ID if exists
		await db.delete(users).where(eq(users.id, 'test_id')).execute();

		// Insert new test user
		await db
			.insert(users)
			.values({
				id: 'test_id',
				age: 99,
				username: 'testuser',
				email: 'testuser@example.com',
				password_hash: passwordHash,
				created_at: new Date(),
				updated_at: new Date()
			})
			.execute();

		console.log('Test user created successfully');
	} catch (error) {
		console.error('Failed to create test user:', error);
	} finally {
		process.exit(0);
	}
}

createTestUser();
