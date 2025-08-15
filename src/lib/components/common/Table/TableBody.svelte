<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import TableRow from "./TableRow.svelte";
    import TableCell from "./TableCell.svelte";
    import { fullWidthColspan } from "$lib/utilities/elements";
    import Loader from "../Loader.svelte";
    import { fade, fly } from "svelte/transition";

    interface Props {
        classes?: string;
        children?: import("svelte").Snippet;
        scrollable?: boolean;
        loading?: Promise<any>;
    }

    let { classes = "", children, scrollable = false, loading }: Props = $props();

    let isLoading = $state(!!loading);

    $effect(() => {
        if (loading) loading.then(() => (isLoading = false));
    });
</script>

<tbody class={twMerge("overflow-x-auto ", classes)} class:overflow-y-auto={scrollable}>
    <!-- <tr class:opacity-0={!isLoading} class:opacity-100={isLoading} class="absolute transition-all duration-250 ease-in-out inset-0 bg-white/80 flex items-center justify-center"> -->
    <!--     <td class=""> -->
    <!--         <Loader /> -->
    <!--     </td> -->
    <!-- </tr> -->
    {#if loading}
        {#await loading then}
            {@render children?.()}
        {/await}
    {:else}
        {@render children?.()}
    {/if}
</tbody>
