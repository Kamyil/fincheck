# Justfile

set shell := ["bash", "-cu"]

start:
	@echo "🐳 Starting database (Docker)..."
	docker compose up -d

	@echo "⏳ Waiting for PostgreSQL to be ready..."
	until docker exec pan-samochodzik-db-1 pg_isready -U admin > /dev/null 2>&1; do \
		echo "  ⌛ Waiting for DB..."; \
		sleep 1; \
	done

	@echo "📦 Running DB migrations..."
	npm run db:migrate

	@echo "🚀 Starting SvelteKit dev server..."
	npm run dev

# Stop: shuts down containers, and kills vite if still running
stop:
	@echo "🛑 Stopping Docker containers..."
	docker compose stop

	@echo "🧨 Killing Vite dev server (if running)..."
	-pkill -f "vite dev" || true

# Down: stops and removes containers, and kills dev server
down:
	@echo "🧹 Killing Vite dev server (if running)..."
	-pkill -f "vite dev" || true

	@echo "🗑️ Stopping and removing containers..."
	docker compose down

# Optional shortcuts
dev:
	npm run dev

db-start:
	docker compose up

db-stop:
	docker compose stop

db-down:
	docker compose down

db-push:
	npm run db:push

db-migrate:
	npm run db:migrate

db-studio:
	npm run db:studio

db-generate-migration:
	npm run db:generate:migration
