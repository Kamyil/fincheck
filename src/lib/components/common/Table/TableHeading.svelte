<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import { type Snippet } from "svelte";

    interface Props {
        classes?: string;
        colspan?: number | undefined;
        onClick?: any;
        children?: Snippet;
    }

    let { classes = "", colspan = undefined, onClick = (event: Event) => {}, children }: Props = $props();
</script>

<th scope="col" class={twMerge("px-6 py-3 text-gray-900", classes)} onclick={onClick} {colspan}>
    <div class="flex justify-center text-center">
        {#if children}
            {@render children()}
        {/if}
    </div>
</th>
