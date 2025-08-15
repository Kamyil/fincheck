# Pan Samochodzik

A SvelteKit 2.0 application with Svelte 5, TypeScript, Drizzle ORM, and containerized development environment.

## Quick Start

The project is fully containerized for a consistent development experience. You'll need:

- Docker and Docker Compose
- Just command runner (`brew install just` on macOS)
- Bun (for local development options - `curl -fsSL https://bun.sh/install | bash`)

### Starting the Application

```bash
# Start the fully containerized application with one command
just start

# The application will be available at:
# http://pan-samochodzik.test (with DNS resolution via dnsmasq)
# http://pan-samochodzik.local (works automatically on macOS/Linux with mDNS)
# http://localhost (works everywhere)
```

This command:

1. Builds and starts all containers (app, database, Traefik, and dnsmasq for DNS resolution)
2. Runs database migrations (which includes creating test and demo users)
3. Starts streaming logs

### Custom Domain Resolution

The application automatically sets up local domain resolution using:

1. **dnsmasq container**: Provides DNS resolution for the `.test` domain
   - Allows you to access the app at `http://pan-samochodzik.test`
   - No need to edit your `/etc/hosts` file
   - Works with Docker's internal networking

2. **mDNS/Bonjour/Avahi**: For the `.local` domain
   - Works automatically on macOS/Linux systems with mDNS support
   - Available at `http://pan-samochodzik.local`

3. **Standard port mapping**: For universal compatibility
   - Always available at `http://localhost`

### Test User Credentials

Once the application is running, you can log in with either of these accounts:

#### Test User

- **Username:** testuser
- **Email:** testuser@example.com
- **Password:** testuser123

#### Demo User

- **Username:** demo
- **Email:** demo@pan-samochodzik.local
- **Password:** pansamochodzik

### Common Development Commands

```bash
# Stop all containers
just stop

# Stop and remove all containers
just down

# Run only the database and develop locally (not in container)
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
- **Authentication**: Custom auth with Argon2 password hashing
- **Package Manager**: Bun (for faster installs and better dependency resolution)
- **Development Environment**: Fully containerized with Docker Compose and Traefik

## Project Structure

- `/src/lib` - Reusable components, utilities and server code
- `/src/routes` - SvelteKit routes
- `/src/lib/server` - Server-only code
- `/drizzle` - Database migrations
- `/messages` - Internationalization files

## Docker Services

- `app`: SvelteKit application with hot-reload
- `db`: PostgreSQL database
- `traefik`: Reverse proxy providing domain name support
- `dnsmasq`: Local DNS server for automatic domain resolution

### Multi-Architecture Support

The Docker setup automatically adapts to your machine's CPU architecture:

- Works on ARM64 (Apple Silicon/M1/M2/M3) and AMD64 (Intel/AMD x86_64) processors
- Uses your host's native architecture by default for optimal performance
- Can be forced to a specific architecture by setting the `DOCKER_DEFAULT_PLATFORM` environment variable:

  ```
  # In .env file to use AMD64 architecture
  DOCKER_DEFAULT_PLATFORM=linux/amd64

  # Or to explicitly use ARM64
  DOCKER_DEFAULT_PLATFORM=linux/arm64
  ```

- Leave `DOCKER_DEFAULT_PLATFORM` unset to use your host's native architecture (recommended)

## Local Development

If you prefer to run the application directly on your host machine instead of in Docker:

1. Install dependencies: `bun install`
2. Start just the database: `just docker compose up -d db`
3. Run migrations: `bun run db:push` (this will also create test and demo users)
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
