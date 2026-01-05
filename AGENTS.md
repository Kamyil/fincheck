# Agent Guidelines

A SvelteKit 2.0 application with Svelte 5, showcasing experimental remote functions and async features.

## Commands

### ALWAYS USE: Container Development

**CRITICAL: This is a containerized application. NEVER run `npm run dev` directly. Always use `just` commands.**

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

**DO NOT USE `npm run dev` - use `just restart-app` instead**

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
- **Icons**: Always import Lucide icons with "Icon" suffix (e.g., `import UserIcon from 'lucide-svelte/icons/user'`) for clarity

## Architecture

- **Custom session-based auth** (not Auth.js) with 30-day sessions and auto-renewal
- **Database schema note**: `username` maps to `login` column in database
- **Test users**: `testuser/testuser123`, `demo/demopassword`

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

- **Route-specific components**: Keep components that are only used by a specific route in a `components/` folder next to the route page rather than in `$lib/components/`
- **Component organization**: `$lib/components/common/` should only contain ultra-reusable UI primitives (Button, Modal, Input, etc.) - thin HTML abstractions. Application-specific components go in `$lib/components/` directly
- **HTTP Status Codes**: Use `$lib/httpStatusCodes.ts` enum instead of hardcoding status code numbers
- **Database Operations**: Always use conditional creation patterns like `CREATE TABLE IF NOT EXISTS` and wrap `ALTER TABLE` statements in `DO $$ BEGIN ... END $$` blocks with existence checks to make all database operations idempotent

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
   import * as v from 'valibot';

   export const getPosts = query(async () => {
   	const posts = await db.sql`SELECT * FROM post ORDER BY created_at DESC`;
   	return posts;
   });

   export const getPost = query(v.string(), async (slug) => {
   	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
   	if (!post) error(404, 'Not found');
   	return post;
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
   	await getLikes(id).refresh();
   });
   ```

### File Structure

- Remote functions should be placed in files with `.remote.ts` or `.remote.js` extension
- Group related functions in domain-specific remote files
- Example path: `src/lib/user/data.remote.ts`

### Usage in Components

```svelte
<script>
	import { getPosts, createPost, addLike } from './data.remote';

	const posts = await getPosts();
</script>

<form {...createPost}>
	<input name="title" />
	<textarea name="content"></textarea>
	<button>Create Post</button>
</form>

<button onclick={() => addLike(post.id).updates(getPosts())}> Like </button>

<svelte:boundary>
	{#each await getPosts() as post}
		<article>{post.title}</article>
	{/each}

	{#snippet pending()}
		<div>Loading posts...</div>
	{/snippet}
</svelte:boundary>
```

### Key Remote Function Benefits

- Automatic form spreading with `{...formFunction}`
- Built-in caching and reactivity for queries
- Type-safe client-server boundary
- Automatic state refresh after mutations
- Progressive enhancement (works without JS)
- Optimistic updates support
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
   getData().refresh();
   await getData().refresh();
   ```

4. For optimistic updates:
   ```typescript
   await addItem(id).updates(getItems().withOverride((items) => [...items, newItem]));
   ```
