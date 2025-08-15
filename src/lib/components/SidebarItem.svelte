<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        isActive?: boolean;
        redirectsTo: `/${string}`;
        rel?: string | undefined;
        children?: import("svelte").Snippet;
    }

    let { isActive = false, redirectsTo, rel = undefined, children }: Props = $props();

    let variants = {
        active: "text-zinc-100 fill-primary stroke-primary bg-primary",
        inactive: "text-gray-100 fill-gray-100 stroke-gray-100 hover:bg-primary",
    } as const;
</script>

<a
    class={twMerge("h-10 text-sm font-normal cursor-pointer flex items-center rounded-md transition-all hover:shadow-md active:scale-95", isActive ? variants.active : variants.inactive)}
    href={redirectsTo}
    {rel}
>
    <div class="mx-5 w-full flex items-center">
        {@render children?.()}
    </div>
</a>
