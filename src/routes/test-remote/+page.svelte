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

<style>
	div {
		margin: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}
</style>
