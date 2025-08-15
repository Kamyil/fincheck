FROM oven/bun:latest

WORKDIR /app

# Copy only the files needed for installation
COPY package.json ./
# COPY bun.lockb ./bun.lockb

# Install dependencies
RUN bun install

# Copy the application code, excluding node_modules from the host
COPY --chown=bun:bun . .

# Expose the port the app will run on
EXPOSE 6969

# Start the application in development mode
CMD ["bun", "run", "dev"]
