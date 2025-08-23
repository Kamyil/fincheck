# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pan Samochodzik** is a Polish automotive platform - a "Digital Automotive Assistant" connecting car owners with mechanics. Built with SvelteKit 2.0 + Svelte 5, showcasing experimental remote functions and async features.

## Development Commands

### Container Management (Preferred)

```bash
just start          # Full containerized startup with migrations
just stop           # Stop containers
just down           # Stop and remove containers
just clean          # Complete cleanup with volumes
just logs           # View application logs
just restart-app    # Restart just the app container
```

### Local Development

```bash
npm run dev         # Development server
npm run build       # Production build
npm run lint        # Code linting (Prettier)
npm run format      # Code formatting
npm run check       # TypeScript + Svelte checking
```

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

Revolutionary client-server communication pattern:

```typescript
// In .remote.ts files
import { query, form, command } from '$app/server';

export const getData = query(async () => {
	/* server logic */
});
export const addItem = form(async (formData) => {
	/* mutation */
});
export const doAction = command(async () => {
	/* immediate action */
});
```

```svelte
<!-- In components - automatic state management -->
<svelte:boundary>
	{#each await getData() as item}
		<form {...addItem}><!-- Automatic form handling --></form>
	{/each}

	{#snippet pending()}
		<div>Loading...</div>
	{/snippet}
</svelte:boundary>
```

**Key Benefits:**

- Automatic form spreading with `{...formFunction}`
- Built-in caching and reactivity for queries
- Type-safe client-server boundary
- Automatic state refresh after mutations

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

- Prefer containerized development with `just start`
- Database migrations auto-run on container startup
- Hot reloading works in both container and local modes
- Use Drizzle Studio for database inspection
