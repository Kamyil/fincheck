# SvelteKit App Starter

A SvelteKit 2.0 application with Svelte 5, TypeScript, Drizzle ORM, and containerized development environment.

## Quick Start

The project is fully containerized for a consistent development experience. You'll need:

- Docker and Docker Compose
- Just command runner (`brew install just` on macOS)
- Bun (for local development options - `curl -fsSL https://bun.sh/install | bash`)

### Starting the Application

```bash
# Start the fully containerized application
just start

# The application will be available at:
# http://localhost
```

This command:

1. Builds and starts all containers (app, database, Traefik)
2. Runs database migrations
3. Starts streaming logs

### Test User Credentials

Once the application is running, you can log in with:

- **Username:** testuser
- **Password:** testuser123

Or:

- **Username:** demo
- **Password:** demopassword

### Common Development Commands

```bash
# Stop all containers
just stop

# Stop and remove all containers
just down

# Run only the database and develop locally
just local-dev

# View application logs
just logs

# Restart just the app container
just restart-app

# Run database operations
just db-migrate
just db-push
just db-studio

# Complete cleanup (removes volumes too)
just clean

# Run tests
just test
just test-unit
just test-e2e
```

## Architecture

- **Frontend**: SvelteKit 2.0 with Svelte 5
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom session-based auth with Argon2 password hashing
- **Package Manager**: Bun
- **Development Environment**: Fully containerized with Docker Compose and Traefik

## Project Structure

- `/src/lib` - Reusable components, utilities and server code
- `/src/routes` - SvelteKit routes
- `/src/lib/server` - Server-only code
- `/drizzle` - Database migrations

## Docker Services

- `app`: SvelteKit application with hot-reload
- `db`: PostgreSQL database
- `traefik`: Reverse proxy

### Multi-Architecture Support

The Docker setup automatically adapts to your machine's CPU architecture:

- Works on ARM64 (Apple Silicon/M1/M2/M3) and AMD64 (Intel/AMD x86_64) processors
- Uses your host's native architecture by default for optimal performance

## Local Development

If you prefer to run the application directly on your host machine instead of in Docker:

1. Install dependencies: `bun install`
2. Start just the database: `docker compose up -d db`
3. Run migrations: `bun run db:push`
4. Start the dev server: `bun run dev`

## Dependency Management

This project uses Bun as its package manager for several advantages:

- **Faster installs**: Bun is significantly faster than npm
- **Better peer dependency resolution**: Helps avoid conflicting peer dependency issues
- **Improved compatibility**: Works well with the latest Svelte 5 and SvelteKit 2.0
- **Simplified toolchain**: Bun provides both a package manager and a runtime

Configuration is in `bunfig.json` to handle dependency overrides.

## Building for Production

To create a production version of the app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

## License

See the LICENSE file for details.
