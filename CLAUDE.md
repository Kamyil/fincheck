# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pan Samochodzik** is a Polish automotive platform - a "Digital Automotive Assistant" connecting car owners with mechanics. Built with SvelteKit 2.0 + Svelte 5, showcasing experimental remote functions and async features.

## Development Commands

### Container Management (ALWAYS USE THIS)

**⚠️ IMPORTANT: This is a containerized application. Always use `just` commands instead of `npm` commands directly.**

```bash
just start          # Full containerized startup with migrations
just stop           # Stop containers
just down           # Stop and remove containers
just clean          # Complete cleanup with volumes
just logs           # View application logs
just restart-app    # Restart just the app container (use instead of npm run dev)
```

### Local Development (Only use when NOT in container)

```bash
npm run build       # Production build
npm run lint        # Code linting (Prettier)
npm run format      # Code formatting
npm run check       # TypeScript + Svelte checking
```

**❌ DO NOT RUN `npm run dev` - use `just start` or `just restart-app` instead**

### Database Operations

```bash
npm run db:push     # Push schema changes to database
npm run db:migrate  # Run pending migrations
npm run db:studio   # Open Drizzle Studio GUI
just db-migrate     # Container version
```

### Testing

```bash
npm run test:unit            # Vitest unit tests
npm run test:e2e            # Playwright E2E tests
npm run test:unit -- <file> # Run specific test file
npm run test               # All tests
```

## Architecture

### Authentication System

- **Custom session-based auth** (not Auth.js) with Argon2 password hashing
- **30-day sessions** with auto-renewal, SHA-256 hashed tokens in database
- **Universal auth hook** in `hooks.server.ts` validates every request
- Auth state available as `event.locals.user` and `event.locals.session`
- Login/register combined in single endpoint with comprehensive validation

### Remote Functions Pattern (Experimental SvelteKit Feature)

Revolutionary client-server communication pattern with four types:

#### 1. Query Functions - For Reading Data

```typescript
// Basic query (no arguments)
export const getPosts = query(async () => {
	const posts = await db.sql`SELECT * FROM post ORDER BY created_at DESC`;
	return posts;
});

// Query with arguments (requires validation schema or 'unchecked')
import * as v from 'valibot';
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

#### 2. Form Functions - For Form Submissions

```typescript
export const createPost = form(async (data) => {
	const user = await getUser();
	if (!user) error(401, 'Unauthorized');

	const title = data.get('title');
	const content = data.get('content');

	if (typeof title !== 'string' || typeof content !== 'string') {
		error(400, 'Title and content are required');
	}

	const slug = title.toLowerCase().replace(/ /g, '-');

	await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;

	// Refresh related queries on server
	await getPosts().refresh();

	redirect(303, `/blog/${slug}`);
});
```

#### 3. Command Functions - For Immediate Actions

```typescript
import * as v from 'valibot';

export const addLike = command(v.string(), async (id) => {
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;

	// Refresh related data
	await getLikes(id).refresh();
});
```

#### 4. Prerender Functions - For Static Data

```typescript
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

#### Usage in Components

```svelte
<script>
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

#### Advanced Patterns

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

**Key Benefits:**

- Automatic form spreading with `{...formFunction}`
- Built-in caching and reactivity for queries
- Type-safe client-server boundary
- Automatic state refresh after mutations
- Progressive enhancement (works without JS)
- Optimistic updates support
- Comprehensive error handling

### Database Schema (Drizzle + PostgreSQL)

```typescript
// Key schema pattern: username maps to "login" column in DB
export const user = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('login').notNull().unique(), // Note: column is "login"
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull()
	// ... timestamps
});
```

### Component Architecture

- **Atomic design**: `components/common/` for reusable UI primitives
- **Feature components**: Organized by domain (Filter/, Charts/, icons/)
- **Table system**: Composable parts (TableBody, TableCell, etc.)
- **Form integration**: Components work seamlessly with remote functions

## Code Style & Conventions

- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes for strings
- **Line width**: 100 characters
- **No trailing commas**
- **Variables**: Prefer `let` over `const` - use `const` only for true constants
- **Components**: PascalCase naming, `.svelte` extension

### File Organization Preferences

- **Route-specific components**: Keep components that are only used by a specific route in a `components/` folder next to the route page (e.g., `src/routes/client/vehicles/components/AddVehicleModal.svelte`) rather than in `$lib/components/`
- **HTTP Status Codes**: Use `$lib/httpStatusCodes.ts` enum instead of hardcoding status code numbers
- **File Access**: Prefer accessing files directly inside Docker container over network requests (unless debugging network issues)
- **Database Operations**: Always use conditional creation patterns like `CREATE TABLE IF NOT EXISTS`, `CREATE TYPE IF NOT EXISTS`, and wrap `ALTER TABLE` statements in `DO $$ BEGIN ... END $$` blocks with existence checks to make all database operations idempotent and safe to re-run

## User Testing & Feedback

- **Ask users to test**: When implementing UI features, authentication flows, or user-facing functionality, ask the user to test the changes in their browser rather than trying to verify through curl or logs
- **Delegate browser testing**: Users can quickly verify if features work as expected, saving time on complex debugging
- **Request specific feedback**: Ask users to perform specific actions (e.g., "Can you login as client_example and check if the vehicle shows up?") for targeted validation

## Key Architectural Patterns

### 1. Session Management Flow

1. `hooks.server.ts` validates session on every request
2. Session token stored as HTTP-only cookie
3. User/session objects attached to `event.locals`
4. 15-day auto-renewal before expiry
5. Automatic cleanup of expired sessions

### 2. Remote Functions Data Flow

1. `query()` functions provide cached, reactive data
2. `form()` functions handle mutations with automatic validation
3. `command()` functions for immediate actions
4. Queries auto-refresh after successful mutations
5. Built-in error states and form validation feedback

### 3. Database Migration Strategy

- Drizzle Kit with timestamp-prefixed migrations
- Environment-based connection via `DATABASE_URL`
- Schema files organized in `src/lib/server/db/schema/`
- Development uses Docker PostgreSQL 16 Alpine

### 4. Containerization Architecture

- **Full Docker Compose stack** with Traefik reverse proxy
- **Multi-domain routing**: `.test` (dnsmasq), `.local` (mDNS), `localhost`
- **Hot reloading** via volume mounts in development
- **Service isolation** with dedicated Docker network

## Test Users

```
Username: testuser / Email: testuser@example.com / Password: testuser123
Username: demo / Email: demo@pan-samochodzik.local / Password: pansamochodzik
```

## Access URLs

- `http://pan-samochodzik.test` (dnsmasq DNS)
- `http://pan-samochodzik.local` (mDNS)
- `http://localhost` (standard port mapping)

## Critical Implementation Notes

### Remote Functions Best Practices

- Always use `<svelte:boundary>` with async markup
- Call `queryFunction().refresh()` to manually refresh data
- Form actions automatically refresh related queries
- Handle loading states with `{#snippet pending()}`

### Authentication Extensions

- User roles can be added to user schema
- Session metadata extensible in session table
- Generic error messages prevent user enumeration
- OAuth integration possible alongside current system

### Database Schema Evolution

- Column name mapping documented in schema comments
- Foreign key constraints should be added for data integrity
- No indexes defined yet - consider for production
- Connection pooling not implemented (single connection per request)

### Development Workflow

- **ALWAYS use containerized development** with `just start`
- **Use `just restart-app` instead of `npm run dev`** when you need to restart the development server
- Database migrations auto-run on container startup
- Hot reloading works in both container and local modes
- Use Drizzle Studio for database inspection
