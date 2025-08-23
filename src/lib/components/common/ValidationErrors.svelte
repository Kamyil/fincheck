<script lang="ts">
	type Props = {
		errors: string[];
	};
	let { errors }: Props = $props();
</script>

{#if errors && errors.length > 0}
	{#each errors as error}
		<span class="text-2xs text-red-500">{error}</span>
	{/each}
{/if}
