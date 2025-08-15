# Agent Guidelines for pan-samochodzik

## Commands

- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Type Check: `npm run check`
- Unit Tests: `npm run test:unit` or `npm run test:unit -- <test-file-path>`
- E2E Tests: `npm run test:e2e`
- DB Commands: `npm run db:push`, `npm run db:migrate`, `npm run db:studio`

## Code Style

- Tabs for indentation (not spaces)
- Single quotes for strings
- No trailing commas
- 100 character line width
- TypeScript with strict mode enabled
- Use Svelte 5 with SvelteKit 2.0
- Component files use `.svelte` extension
- Follow TailwindCSS conventions for styling

## Structure

- `/src/lib` - reusable components, utilities and server code
- `/src/routes` - SvelteKit routes
- `/src/lib/server` - server-only code
- `/drizzle` - database migrations

## Conventions

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use Paraglide for internationalization
- Use Drizzle ORM for database operations
- Keep components small and focused
- Use named exports for clarity

## Error Handling

- Use proper TypeScript types
- Handle form validation with SuperForms
- Always validate user input on the server
