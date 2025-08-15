<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        classes?: string;
        children?: import("svelte").Snippet;
    }

    let { classes = "", children }: Props = $props();
</script>

<thead class={twMerge("text-xs text-stone-400 border-b-1", classes)}>
    {@render children?.()}
</thead>
