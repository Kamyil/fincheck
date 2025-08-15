# Svelte and SvelteKit Upgrade Log - August 2025

## Initial Goals

- Upgrade Svelte to latest version (5.38.1)
- Upgrade SvelteKit to latest version (2.29.1)
- Enable experimental "async" feature in Svelte
- Enable experimental "remote functions" in SvelteKit

## Steps Taken

### 1. Checking Current Versions

```bash
npm list svelte @sveltejs/kit
```

Found:

- svelte: 5.16.0
- @sveltejs/kit: 2.15.1

### 2. Checking Latest Available Versions

```bash
npm view svelte @sveltejs/kit version
```

Found:

- svelte: 5.38.1
- @sveltejs/kit: 2.29.1

### 3. Updating Packages

```bash
npm install svelte@latest @sveltejs/kit@latest
```

### 4. Updating Related Packages

We needed to update Vite first due to dependency constraints:

```bash
npm install vite@latest
```

Then tried to update Svelte Vite plugin:

```bash
npm install @sveltejs/vite-plugin-svelte@latest --force
```

### 5. Modifying Svelte Configuration

Initially tried enabling both runes mode (which includes async support) and remote functions:

```javascript
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		},
		experimental: {
			remoteFunctions: true
		}
	},
	extensions: ['.svelte', '.svx'],
	compilerOptions: {
		runes: true
	}
};
```

### 6. Running Checks and Troubleshooting

Ran `npm run check` to identify issues with the new configuration.

Encountered several issues with component compatibility in runes mode:

- `$$restProps` is not allowed in runes mode
- Component slot syntax needed updating
- Type definitions needed to be more specific
- Event handling syntax changed from `on:click` to `onclick`

### 7. Reverting to Compatibility Mode

Due to compatibility issues with dependencies, we decided to:

- Keep the Svelte and SvelteKit upgrades
- Disable runes mode temporarily
- Keep the experimental Remote Functions feature enabled

Final configuration in svelte.config.js:

```javascript
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		},
		experimental: {
			remoteFunctions: true
		}
	},
	extensions: ['.svelte', '.svx']
};
```

### 8. Testing Remote Functions

Created test files to demonstrate Remote Functions:

```typescript
// src/routes/test-remote/data.remote.ts
import { query } from '$app/server';

export const getData = query(async () => {
	return {
		message: 'Hello from remote function!',
		timestamp: new Date().toISOString()
	};
});
```

```svelte
<!-- src/routes/test-remote/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { getData } from './data.remote';

	let data = { message: 'Loading...', timestamp: '' };
	let refreshCount = 0;

	onMount(async () => {
		data = await getData();
	});

	const refresh = async () => {
		await getData().refresh();
		data = await getData();
		refreshCount++;
	};
</script>

<h1>Testing Remote Functions</h1>

<div>
	<p>Message: {data.message}</p>
	<p>Timestamp: {data.timestamp}</p>
	<p>Refresh count: {refreshCount}</p>

	<button on:click={refresh}>Refresh Data</button>
</div>
```

### 9. Created Documentation

Created comprehensive documentation for Remote Functions in:

- `/documentation/remote-functions.md`
- Updated `/documentation/plany.md`

## Key Learnings

1. Svelte 5's runes mode introduces breaking changes that require updates to component syntax
2. Some dependencies may not be fully compatible with runes mode yet
3. Remote Functions can be enabled independently of runes mode
4. Migration to runes should be a separate project when dependencies are ready

## Future Considerations

- Consider migrating to Svelte 5 runes mode when dependencies have better support
- Monitor the stability and evolution of the Remote Functions API
- Plan for incremental component updates to use the new syntax

## Additional Notes

- The database is handled through Docker with PostgreSQL
- Remote Functions test pages are available at `/test-remote`
