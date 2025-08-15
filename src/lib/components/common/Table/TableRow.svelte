<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import { type Snippet } from "svelte";

    interface Props {
        classes?: string;
        /** When true, it will mark text with red color */
        error?: boolean;
        /** When true, it will have darker background */
        striped?: boolean;
        /** When true, each table row will be separated with a dark border at the bottom  */
        bordered?: boolean;
        children?: Snippet;
        index?: number;
    }

    let { classes = "", error = false, striped = true, bordered = false, children }: Props = $props();
</script>

<tr class={twMerge("p-2 transition-all duration-150 border-b border-b-stone-200", classes)} class:error class:even:bg-stone-100={striped} class:bordered>
    {@render children?.()}
</tr>

<style lang="postcss">
    @reference "tailwindcss";

    .bordered {
        @apply border-b-1 last:border-b-0;
    }

    .error {
        @apply text-red-800 bg-red-50 even:bg-red-50;
    }
</style>
