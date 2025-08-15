<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        title?: HTMLTableCellElement['title'] | undefined;
        classes?: string;
        rowspan?: number | undefined;
        colspan?: number | undefined;
        children?: import('svelte').Snippet;
    }

    let {
        title = undefined,
        classes = "",
        rowspan = undefined,
        colspan = undefined,
        children
    }: Props = $props();
</script>

<td class={twMerge("px-1", classes)} {rowspan} {colspan} {title}>
    {@render children?.()}
</td>
