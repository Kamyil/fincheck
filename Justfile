# Justfile

set shell := ["bash", "-cu"]
set dotenv-load := true

# Default recipe to display help
default:
    @just --list

# Start the entire containerized application stack with domain support
start:
    @echo "ℹ️  Starting application..."
    
    @echo "🐳 Starting containers..."
    docker compose up --build -d
    
    @echo "⏳ Waiting for PostgreSQL to be ready..."
    until docker compose exec db pg_isready -U admin > /dev/null 2>&1; do \
        echo "  ⌛ Waiting for DB..."; \
        sleep 1; \
    done
    
    @echo "📦 Running DB migrations..."
    just db-migrate

    @echo "💾 Drizzle Gateway will be available shortly for database management..."
    
    @echo "🚀 Application is running!"
    @echo "  - https://app.test (with DNS resolution via dnsmasq) 🔒"
    @echo "  - https://app.local (automatic on macOS/Linux with mDNS) 🔒"
    @echo "  - https://localhost (works everywhere) 🔒"
    @echo "  - HTTP URLs will redirect to HTTPS automatically"
    @echo "📊 Traefik dashboard is available at http://localhost:8080"
    @echo "💾 Drizzle Gateway is available at:"
    @echo "  - https://drizzle.localhost"
    @echo "  - Direct access: http://localhost:4983"
    @echo ""
    @echo "⚠️  Your browser will show a security warning for self-signed certificates"
    @echo "   Click 'Advanced' → 'Proceed to localhost (unsafe)' to continue"
    @echo "Use 'just logs' to view application logs"
    @echo "Use 'just logs-app' to view only app logs"

# Run the application in dev mode directly on the host (not containerized)
local-dev:
    @echo "🐳 Starting database only..."
    docker compose up -d db
    
    @echo "⏳ Waiting for PostgreSQL to be ready..."
    until docker compose exec db pg_isready -U admin > /dev/null 2>&1; do \
        echo "  ⌛ Waiting for DB..."; \
        sleep 1; \
    done

    @echo "📦 Running DB migrations locally..."
    DATABASE_URL="postgres://admin:devpassword123@localhost:5432/local" bun run db:push
    
    @echo "🚀 Starting SvelteKit dev server..."
    DATABASE_URL="postgres://admin:devpassword123@localhost:5432/local" bun run dev

# Stop all containers
stop:
    @echo "🛑 Stopping Docker containers..."
    docker compose stop

# Stop and remove all containers
down:
    @echo "🗑️ Stopping and removing containers..."
    docker compose down

# Restart the application container
restart-app:
    docker compose restart app

# Database commands
db-migrate:
    docker compose exec app bun run db:migrate

db-push:
    docker compose exec app bun run db:push

db-gateway:
    @echo "💾 Drizzle Gateway is running at:"
    @echo "  - https://drizzle.localhost"
    @echo "  - Direct access: http://localhost:4983"
    @echo ""
    @echo "Master password: devpassword123"

db-generate-migration:
    docker compose exec app bun run db:generate:migration

# Show logs
logs:
    docker compose logs -f

# Show logs for a specific service
logs-app:
    docker compose logs -f app

logs-db:
    docker compose logs -f db

rebuild:
    @echo "🔄 Rebuilding application..."
    docker-compose build --no-cache
    @echo "✅ Application rebuilt successfully!"

# Clean everything and start fresh
cleanup:
    @echo "🧹 Cleaning everything..."
    docker compose down -v
    @echo "✅ Done! Run 'just start' to start fresh."

# Run tests
test:
    docker compose exec app bun test

test-e2e:
    docker compose exec app bun run test:e2e

test-unit:
    docker compose exec app bun run test:unit

revamp:
    @echo "🔄 Revamping application..."
    just down
    just cleanup
    just rebuild
    just start
    @echo "✅ Application revamped successfully!"
