# Agent Guidelines for pan-samochodzik

**Pan Samochodzik** is a Polish automotive platform built with SvelteKit 2.0 + Svelte 5, showcasing experimental remote functions and async features.

## Commands

### ALWAYS USE: Container Development

**⚠️ CRITICAL: This is a containerized application. NEVER run `npm run dev` directly. Always use `just` commands.**

- Start: `just start` (full containerized startup with migrations)
- Restart: `just restart-app` (use this instead of npm run dev)
- Stop: `just stop`
- Clean: `just clean` (complete cleanup)
- Logs: `just logs`
- DB Migrate: `just db-migrate`

### Local Development (Only when NOT using containers)

- Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`
- Type Check: `npm run check`
- Unit Tests: `npm run test:unit` or `npm run test:unit -- <test-file-path>`
- E2E Tests: `npm run test:e2e`
- DB Commands: `npm run db:push`, `npm run db:migrate`, `npm run db:studio`

**❌ DO NOT USE `npm run dev` - use `just restart-app` instead**

## Code Style

- Tabs for indentation (not spaces)
- Single quotes for strings
- No trailing commas
- 100 character line width
- TypeScript with strict mode enabled
- Prefer `let` over `const` - use `const` only for true constants
- Use Svelte 5 with SvelteKit 2.0
- Component files use `.svelte` extension
- Follow TailwindCSS conventions for styling
- **Icons**: Always import Lucide icons with "Icon" suffix (e.g., `import CarIcon from 'lucide-svelte/icons/car'` instead of `import Car from 'lucide-svelte/icons/car'`) for clarity

## Architecture

- **Custom session-based auth** (not Auth.js) with 30-day sessions and auto-renewal
- **Database schema note**: `username` maps to `login` column in database
- **Multi-domain setup**: `.test` (dnsmasq), `.local` (mDNS), `localhost`
- **Test users**: `testuser/testuser123`, `demo/pansamochodzik`

## Structure

- `/src/lib` - reusable components, utilities and server code
- `/src/routes` - SvelteKit routes
- `/src/lib/server` - server-only code
- `/drizzle` - database migrations

## Conventions

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use Drizzle ORM for database operations
- Keep components small and focused
- Use named exports for clarity
- **ALWAYS use containerized development** with `just start`
- **Use `just restart-app` instead of `npm run dev`** for restarting the server
- **Always validate user input on server**

### File Organization Preferences

- **Route-specific components**: Keep components that are only used by a specific route in a `components/` folder next to the route page (e.g., `src/routes/client/vehicles/components/AddVehicleModal.svelte`) rather than in `$lib/components/`
- **Component organization**: `$lib/components/common/` should only contain ultra-reusable UI primitives (Button, Modal, Input, etc.) - thin HTML abstractions. Application-specific components go in `$lib/components/` directly
- **HTTP Status Codes**: Use `$lib/httpStatusCodes.ts` enum instead of hardcoding status code numbers
- **File Access**: Prefer accessing files directly inside Docker container over network requests (unless debugging network issues)
- **Database Operations**: Always use conditional creation patterns like `CREATE TABLE IF NOT EXISTS`, `CREATE TYPE IF NOT EXISTS`, and wrap `ALTER TABLE` statements in `DO $$ BEGIN ... END $$` blocks with existence checks to make all database operations idempotent and safe to re-run

## User Testing & Feedback

- **Ask users to test**: When implementing UI features, authentication flows, or user-facing functionality, ask the user to test the changes in their browser rather than trying to verify through curl or logs
- **Delegate browser testing**: Users can quickly verify if features work as expected, saving time on complex debugging
- **Request specific feedback**: Ask users to perform specific actions (e.g., "Can you login as client_example and check if the vehicle shows up?") for targeted validation

## Error Handling

- Use proper TypeScript types
- Handle form validation with SvelteKit's native form validation or SuperForms when needed
- Always validate user input on the server

## Data Handling with Remote Functions

The application uses SvelteKit's experimental remote functions for data handling, which provides type-safe client-server communication without manually creating API endpoints.

### Remote Function Types

1. **Query Functions** - For fetching data from the server:

   ```typescript
   import { query } from '$app/server';
   import * as v from 'valibot'; // For validation

   // Basic query (no arguments)
   export const getPosts = query(async () => {
   	const posts = await db.sql`SELECT * FROM post ORDER BY created_at DESC`;
   	return posts;
   });

   // Query with validation
   export const getPost = query(v.string(), async (slug) => {
   	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
   	if (!post) error(404, 'Not found');
   	return post;
   });

   // Unchecked query (skip validation - use carefully)
   export const getHealthRecords = query('unchecked', async (vehicleId: string) => {
   	return await db.select().from(healthRecords).where(eq(healthRecords.vehicleId, vehicleId));
   });
   ```

2. **Form Functions** - For handling form submissions:

   ```typescript
   import { form } from '$app/server';

   export const createPost = form(async (data) => {
   	const user = await getUser();
   	if (!user) error(401, 'Unauthorized');

   	const title = data.get('title');
   	const content = data.get('content');

   	if (typeof title !== 'string' || typeof content !== 'string') {
   		error(400, 'Title and content are required');
   	}

   	await db.sql`INSERT INTO post (title, content) VALUES (${title}, ${content})`;

   	// Refresh related queries on server (single-flight mutation)
   	await getPosts().refresh();

   	redirect(303, `/blog/${slug}`);
   });
   ```

3. **Command Functions** - For immediate actions:

   ```typescript
   import { command } from '$app/server';
   import * as v from 'valibot';

   export const addLike = command(v.string(), async (id) => {
   	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;

   	// Refresh related data
   	await getLikes(id).refresh();
   });
   ```

4. **Prerender Functions** - For static data that changes infrequently:

   ```typescript
   import { prerender } from '$app/server';

   export const getStaticPosts = prerender(async () => {
   	return await db.sql`SELECT * FROM featured_posts`;
   });

   // With inputs for build-time prerendering
   export const getPost = prerender(
   	v.string(),
   	async (slug) => {
   		/* ... */
   	},
   	{
   		inputs: () => ['first-post', 'second-post', 'third-post'],
   		dynamic: true // Allow runtime calls to non-prerendered inputs
   	}
   );
   ```

### File Structure

- Remote functions should be placed in files with `.remote.ts` or `.remote.js` extension
- Group related functions in domain-specific remote files
- Example path: `src/lib/user/data.remote.ts`

### Usage in Components

```svelte
<script>
	// Import remote functions
	import { getPosts, createPost, addLike } from './data.remote';

	// Query usage with await
	const posts = await getPosts();

	// Or with reactive properties
	const query = getPosts();
	// query.loading, query.error, query.current available
</script>

<!-- Form usage -->
<form {...createPost}>
	<input name="title" />
	<textarea name="content"></textarea>
	<button>Create Post</button>
</form>

<!-- Command usage -->
<button onclick={() => addLike(post.id).updates(getPosts())}> Like </button>

<!-- Query with arguments -->
<svelte:boundary>
	{#each await getPosts() as post}
		<article>{post.title}</article>
	{/each}

	{#snippet pending()}
		<div>Loading posts...</div>
	{/snippet}
</svelte:boundary>

<!-- Handle form results -->
{#if createPost.result?.success}
	<p>Post created successfully!</p>
{:else if createPost.result?.error}
	<p class="error">{createPost.result.error}</p>
{/if}
```

### Advanced Patterns

**Single-Flight Mutations** - Refresh specific queries without full page reload:

```typescript
// Server-side refresh
export const createPost = form(async (data) => {
	// ... create post
	await getPosts().refresh(); // Refreshed data sent with response
	redirect(303, `/blog/${slug}`);
});
```

```svelte
<!-- Client-side refresh with optimistic updates -->
<form {...createPost.enhance(async ({ submit }) => {
	await submit().updates(
		getPosts().withOverride(posts => [...posts, newPost])
	);
})}>
```

**Query Refresh Methods:**

```svelte
<script>
	// Manual refresh
	const refreshPosts = () => getPosts().refresh();

	// Queries are cached: getPosts() === getPosts()
	// No need to store references for refreshing
</script>

<button onclick={refreshPosts}>Refresh Posts</button>
```

**Form Enhancement:**

```svelte
<form {...createPost.enhance(async ({ form, data, submit }) => {
	try {
		await submit();
		form.reset();
		showToast('Success!');
	} catch (error) {
		showToast('Error!');
	}
})}>
```

**Multi-form Actions (buttonProps):**

```svelte
<form {...login}>
	<input name="username" />
	<input name="password" type="password" />
	<button>Login</button>
	<button {...register.buttonProps}>Register</button>
</form>
```

### Key Remote Function Benefits

- Automatic form spreading with `{...formFunction}`
- Built-in caching and reactivity for queries
- Type-safe client-server boundary
- Automatic state refresh after mutations
- Progressive enhancement (works without JS)
- Optimistic updates support
- Comprehensive error handling
- Single-flight mutations (no extra round trips)

## Async Svelte

The application uses Svelte's experimental async feature, which allows using `await` directly in:

- The top level of a component's `<script>` tag
- Inside `$derived(...)` declarations
- Inside component markup

### Usage Guidelines

1. Always wrap components that use `await` in markup with a `<svelte:boundary>` element:

   ```svelte
   <svelte:boundary>
   	<p>{await getData()}</p>

   	{#snippet pending()}
   		<p>Loading...</p>
   	{/snippet}
   </svelte:boundary>
   ```

2. For derived state:

   ```svelte
   <script>
   	import { getData } from './data.remote';

   	let result = $derived(await getData());
   </script>
   ```

3. To refresh data:

   ```typescript
   // Client-side refresh
   getData().refresh();

   // Server-side refresh in a form or command
   await getData().refresh();
   ```

4. For optimistic updates:
   ```typescript
   await addItem(id).updates(getItems().withOverride((items) => [...items, newItem]));
   ```
