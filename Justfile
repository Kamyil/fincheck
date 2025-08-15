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
    
    @echo "👤 Creating test user..."
    just create-test-user
    
    @echo "🚀 Application is running!"
    @echo "  - http://pan-samochodzik.test (with DNS resolution via dnsmasq)"
    @echo "  - http://pan-samochodzik.local (automatic on macOS/Linux with mDNS)"
    @echo "  - http://localhost (works everywhere)"
    @echo "📊 Traefik dashboard is available at http://localhost:8080"
    @echo "💾 Database is accessible at localhost:5432"
    @echo ""
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
    DATABASE_URL="postgres://admin:pansamochodzik123@localhost:5432/local" bun run db:push
    
    @echo "🚀 Starting SvelteKit dev server..."
    DATABASE_URL="postgres://admin:pansamochodzik123@localhost:5432/local" bun run dev

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

db-studio:
    DATABASE_URL="postgres://admin:pansamochodzik123@localhost:5432/local" bun run db:studio

db-generate-migration:
    docker compose exec app bun run db:generate:migration

# Create test user
create-test-user:
    @echo "👤 Creating test user..."
    docker compose exec app node -e "const { hash } = require('@node-rs/argon2'); const { db } = require('./src/lib/server/db'); const { users } = require('./src/lib/server/db/schema/users'); const { eq } = require('drizzle-orm'); (async () => { try { const passwordHash = await hash('testuser123', { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 }); await db.delete(users).where(eq(users.id, 'test_id')).execute(); await db.insert(users).values({ id: 'test_id', age: 99, username: 'testuser', email: 'testuser@example.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() }).execute(); console.log('Test user created successfully'); } catch (error) { console.error('Failed to create test user:', error); } })()"
    @echo "✅ Test user created with username: testuser, password: testuser123"

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
