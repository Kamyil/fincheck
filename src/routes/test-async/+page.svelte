<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let result = 'Loading...';
	let count = 0;

	onMount(async () => {
		if (browser) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			result = 'Data loaded asynchronously!';
		} else {
			result = 'Server rendered';
		}
	});

	function increment() {
		count++;
	}
</script>

<h1>Testing Async</h1>

<div>
	<p>Async result: {result}</p>
	<p>Counter: {count}</p>
	<button on:click={increment}>Increment</button>
</div>

<style>
	div {
		margin: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}
</style>
