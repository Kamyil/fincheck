# Claude Code Project Context - Pan Samochodzik

## Project Overview
**Pan Samochodzik** is a comprehensive Polish automotive platform - a "Digital Automotive Assistant" that connects car owners with mechanics and provides automotive services.

## Tech Stack
- **Frontend**: SvelteKit 2.0 with Svelte 5 (latest versions)
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS 4.0
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom auth with Argon2 password hashing
- **Package Manager**: Bun (preferred for faster installs)
- **Development**: Fully containerized with Docker Compose + Traefik
- **Architecture**: Multi-architecture Docker support (ARM64/AMD64)

## Key Features
- 🔧 **Mechanic Finder** - Find trusted mechanics with reviews
- 📋 **Car Health Book** - Track service history and vehicle status  
- ⚙️ **Parts Ordering** - Direct parts ordering through the app
- 👥 **Community** - Connect mechanics and car owners

## Architecture Highlights
- **Remote Functions**: Uses SvelteKit's experimental remote functions for type-safe client-server communication
- **Async Svelte**: Leverages Svelte 5's async features with `<svelte:boundary>`
- **Domain Resolution**: Custom DNS setup with dnsmasq for `.test` domains

## Project Structure
```
src/
├── lib/
│   ├── components/         # Reusable Svelte components
│   ├── server/            # Server-only code (auth, db)
│   ├── todos/             # Todo feature with remote functions
│   ├── user/              # User-related functionality
│   └── utils/             # Utility functions
├── routes/                # SvelteKit routes
│   ├── login/logout/      # Authentication pages
│   ├── todos/             # Todo demo page
│   └── +page.svelte       # Landing page
drizzle/                   # Database migrations
docs/                      # Empty directory
```

## Code Style & Conventions
- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes for strings
- **Line width**: 100 characters
- **No trailing commas**
- **Variable declarations**: Prefer `let` over `const` - use `const` only for ACTUAL constants (not arrays/objects that can be mutated)
- **Component naming**: PascalCase for components
- **File extensions**: `.svelte` for components, `.ts` for TypeScript

## Development Commands
```bash
# Container management
just start          # Full containerized startup
just stop           # Stop containers
just down           # Stop and remove containers
just clean          # Complete cleanup with volumes

# Local development
npm run dev         # Development server
npm run build       # Production build
npm run lint        # Code linting
npm run format      # Code formatting
npm run check       # TypeScript checking

# Database
npm run db:push     # Push schema changes
npm run db:migrate  # Run migrations
npm run db:studio   # Open Drizzle Studio

# Testing
npm run test        # All tests
npm run test:unit   # Unit tests with Vitest
npm run test:e2e    # E2E tests with Playwright
```

## Current Status
- ✅ Working authentication system (login/logout)
- ✅ Containerized development environment
- ✅ Todo functionality with remote functions
- ✅ Landing page with Polish content
- ✅ Database setup with test users

## Test Users
```
Username: testuser
Email: testuser@example.com
Password: testuser123

Username: demo  
Email: demo@pan-samochodzik.local
Password: pansamochodzik
```

## Access URLs
- `http://pan-samochodzik.test` (with dnsmasq)
- `http://pan-samochodzik.local` (mDNS)
- `http://localhost` (standard)

## Remote Functions Pattern
The project uses SvelteKit's experimental remote functions for type-safe server communication:

```typescript
// In .remote.ts files
import { query, form, command } from '$app/server';

export const getData = query(async () => {
  // Server-side data fetching
});

export const submitForm = form(async (formData) => {
  // Form handling
});
```

```svelte
<!-- In components -->
<svelte:boundary>
  {#each await getData() as item}
    <!-- Render data -->
  {/each}
  
  {#snippet pending()}
    <div>Loading...</div>
  {/snippet}
</svelte:boundary>
```

## Recent Changes (Git Status)
- Modified: `src/app.css`, `src/routes/+page.svelte`, `src/routes/todos/+page.svelte`
- Untracked: `src/lib/httpStatusCodes.ts`
- Recent commits: Working login/logout, containerization, migrations setup

## Notes
- Project uses Polish language for UI content
- Comprehensive HTTP status codes enum available
- Docker setup includes Traefik for reverse proxy
- Custom DNS resolution for local development
- Bun is preferred package manager for better dependency resolution