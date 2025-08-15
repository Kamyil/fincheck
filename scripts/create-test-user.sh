#!/bin/bash

# Ensure the database is running
echo "Ensuring database is running..."
docker compose up -d

# Run the create user script
echo "Creating test user..."
npx tsx create-test-user.ts