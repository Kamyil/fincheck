<script lang="ts" module>
    export let sizes = {
        small: "w-8 h-8 text-xs",
        medium: "w-12 h-12",
        large: "w-16 h-16",
    };
</script>

<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        classes?: string;
        active: boolean;
        onClick?: any;
        size: keyof typeof sizes;
        children?: import('svelte').Snippet;
    }

    let {
        classes = "",
        active,
        onClick = (event: Event) => {},
        size,
        children
    }: Props = $props();
</script>

<button
    class={twMerge(
        "mx-2 shadow-md flex items-center justify-center rounded-md cursor-pointer duration-150 transition-all bg-gray-50 border-1 border-gray-300 hover:bg-white active:scale-95",
        sizes[size],
        active ? "border-primary bg-white" : "",
        classes,
    )}
    onclick={(event) => onClick(event)}
    onkeypress={(event) => onClick(event)}
>
    {@render children?.()}
</button>
