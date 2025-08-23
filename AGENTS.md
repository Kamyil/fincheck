# Agent Guidelines for pan-samochodzik

**Pan Samochodzik** is a Polish automotive platform built with SvelteKit 2.0 + Svelte 5, showcasing experimental remote functions and async features.

## Commands

### Preferred: Container Development

- Start: `just start` (full containerized startup with migrations)
- Stop: `just stop`
- Clean: `just clean` (complete cleanup)
- Logs: `just logs`
- DB Migrate: `just db-migrate`

### Local Development

- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Type Check: `npm run check`
- Unit Tests: `npm run test:unit` or `npm run test:unit -- <test-file-path>`
- E2E Tests: `npm run test:e2e`
- DB Commands: `npm run db:push`, `npm run db:migrate`, `npm run db:studio`

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
- **Prefer containerized development** with `just start`
- **Always validate user input on server**

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

   export const getData = query(async () => {
   	// Server-side code to fetch data
   	return {
   		/* your data */
   	};
   });
   ```

2. **Form Functions** - For handling form submissions:

   ```typescript
   import { form } from '$app/server';

   export const submitForm = form(async (formData) => {
   	// Process form data
   	return { success: true };
   });
   ```

3. **Command Functions** - For immediate actions:

   ```typescript
   import { command } from '$app/server';

   export const performAction = command(async () => {
   	// Execute action
   	return { success: true };
   });
   ```

4. **Prerender Functions** - For static data that changes infrequently:

   ```typescript
   import { prerender } from '$app/server';

   export const getStaticData = prerender(async () => {
   	// Get static data
   	return {
   		/* your static data */
   	};
   });
   ```

### File Structure

- Remote functions should be placed in files with `.remote.ts` or `.remote.js` extension
- Group related functions in domain-specific remote files
- Example path: `src/lib/user/data.remote.ts`

### Usage in Components

```svelte
<script>
	// Import remote functions
	import { getData, submitForm } from '$lib/data.remote';
</script>

<!-- Query usage with async -->
<svelte:boundary>
	<div>
		{#key getData().current}
			{@const data = await getData()}
			<p>{data.value}</p>
		{/key}
	</div>

	{#snippet pending()}
		<p>Loading...</p>
	{/snippet}
</svelte:boundary>

<!-- Form usage -->
<form {...submitForm}>
	<input name="field" />
	<button type="submit">Submit</button>
</form>

<!-- Access form result -->
{#if submitForm.result?.success}
	<p>Form submitted successfully!</p>
{/if}
```

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
