<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { fullWidthColspan } from '$lib/utilities/elements';
	import { browser } from '$app/environment';

	interface Props {
		/** When true, it will put the message inside <tr> and <td> and it will center it there */
		insideTable?: boolean;
	}

	let { insideTable = false }: Props = $props();
</script>

{#if browser}
	{#if insideTable}
		<tr>
			<!--

                    |- Kinda ugly hack, but unfortunetly an necessary one if we want to have auto-centering capability inside a table
                    | The case is - if we want to display no records message, nicely centered inside the table
                    | then we need to unfortunetly know how many columns we have in a table since HTML tables
                    | do not have simple CSS class to center something inside the table. The only way is to manually pass the colspan number (that can vary in each table)
                    | which will give an element a full witdth. So we need to know dynamically how much of a colspan we need to make it centered.
                    v And this code does that
    -->
			<td use:fullWidthColspan transition:fade>
				<div class="grid place-items-center p-16 text-xs text-gray-500">Brak wyników</div>
			</td>
		</tr>
	{:else}
		<!-- TODO: When app will be migrated to Svelte 5, then move this div to the snippet and reuse it in {#if insideTable} block -->
		<div class="grid place-items-center p-16 text-xs text-gray-500" transition:fade>
			Brak wyników
		</div>
	{/if}
{/if}
