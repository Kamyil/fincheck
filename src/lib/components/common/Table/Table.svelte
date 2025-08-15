<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import Loader from "../Loader.svelte";

    interface Props<T> {
        classes?: string;
        loading?: Promise<T>;
        children?: import("svelte").Snippet;
        scrollable?: {
            height: string;
        };
    }

    // TODO: remove this after replacing it's usages with $shared-lib version

    let { classes = "", children, scrollable, loading }: Props<{}> = $props();
</script>

<!-- {#if loading} -->
<!--     {#await loading} <Loader /> {/await} -->
<!-- {/if} -->
{#if scrollable}
    <div class="overflow-y-scroll" style="height: {scrollable.height}">
        <table class={twMerge("w-full text-left text-sm overflow-x-auto ", classes)}>
            {@render children?.()}
        </table>
    </div>
{:else}
    <table class={twMerge("w-full text-left text-sm overflow-x-auto ", classes)}>
        {@render children?.()}
    </table>
{/if}

<style>
    th {
        position: sticky;
        background-color: white;
        z-index: 2;
        top: 0;
    }
</style>
