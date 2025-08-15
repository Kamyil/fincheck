<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="container mx-auto p-8">
	<h1 class="mb-6 text-2xl font-bold">Login</h1>
	<form method="post" action="?/login" use:enhance>
		<div class="mb-4">
			<label class="mb-1 block">
				Username
				<input
					name="username"
					class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</label>
		</div>
		<div class="mb-6">
			<label class="mb-1 block">
				Password
				<input
					type="password"
					name="password"
					class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</label>
		</div>
		<div class="flex gap-4">
			<button class="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
				>Login</button
			>
			<button
				formaction="?/register"
				class="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
				>Register</button
			>
		</div>
	</form>
	{#if form?.message}
		<p class="mt-4 text-red-600">{form.message}</p>
	{/if}
</div>
