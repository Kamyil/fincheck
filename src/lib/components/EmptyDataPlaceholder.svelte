<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        classes?: string;
        children?: import('svelte').Snippet;
    }

    let { classes = "", children }: Props = $props();
</script>

<div
    class={twMerge(
        "w-full h-72 text-stone-700 flex text-center items-center justify-center ",
        classes,
    )}
>
    <h1>{@render children?.()}</h1>
</div>
