# Using SvelteKit Remote Functions

SvelteKit Remote Functions is an experimental feature that allows you to write server-side functions that can be easily called from the client. This feature eliminates the need to manually create API endpoints and makes client-server communication type-safe and straightforward.

## Basic Usage

### 1. Create a Remote Functions File

Create a `.remote.ts` file in your routes directory (or anywhere in `src/lib`):

```typescript
// src/routes/mydata.remote.ts
import { query, command } from '$app/server';

// Query: Read-only operation
export const getData = query(async () => {
	// This code runs on the server
	return {
		message: 'Hello from the server!',
		timestamp: new Date().toISOString()
	};
});

// Command: Write operation
export const updateData = command(async (newData) => {
	// This code runs on the server and can modify data
	console.log('Updating data:', newData);
	// Update database or other resources...
	return { success: true };
});
```

### 2. Call Remote Functions from Components

```svelte
<script>
	import { getData, updateData } from './mydata.remote';
	import { onMount } from 'svelte';

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

	const update = async () => {
		await updateData({ newValue: 'Updated content' });
		// Refresh data after update
		data = await getData();
	};
</script>

<div>
	<p>Message: {data.message}</p>
	<p>Timestamp: {data.timestamp}</p>
	<p>Refresh count: {refreshCount}</p>

	<button on:click={refresh}>Refresh Data</button>
	<button on:click={update}>Update Data</button>
</div>
```

## Form Handling

Remote functions also provide a clean way to handle form submissions:

```typescript
// src/routes/forms.remote.ts
import { form } from '$app/server';

export const submitForm = form(async (formData) => {
	// Access form fields
	const name = formData.get('name');
	const email = formData.get('email');

	// Process form data on the server
	console.log('Form submission:', { name, email });

	// Return success message
	return {
		success: true,
		message: 'Form submitted successfully!'
	};
});
```

```svelte
<script>
	import { submitForm } from './forms.remote';

	let result = null;

	const handleSubmit = async () => {
		result = await submitForm();
	};
</script>

<form {...submitForm} on:submit={handleSubmit}>
	<input name="name" placeholder="Name" required />
	<input name="email" type="email" placeholder="Email" required />
	<button type="submit">Submit</button>
</form>

{#if result}
	<p>{result.message}</p>
{/if}
```

## Benefits

- Type-safety between client and server
- No need to manually create API endpoints
- Simplified data fetching and mutations
- Automatic form handling
- Efficient caching and refreshing of data

## Notes

- This is an experimental feature and may change in future releases
- Make sure to validate user inputs on the server side
- For production use, ensure proper error handling and security measures
