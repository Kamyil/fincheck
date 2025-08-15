<script lang="ts">
    interface Props {
        isActive?: boolean;
        redirectsTo: `/${string}`;
        rel?: string | undefined;
        children?: import("svelte").Snippet;
    }

    let { isActive = false, redirectsTo, rel = undefined, children }: Props = $props();

    let variants = {
        active: "text-primary fill-primary stroke-primary bg-white",
        inactive: "text-gray-900 fill-gray-100 bg-gray-200 stroke-gray-100 hover:bg-primary hover:text-white",
    } as const;
</script>

<a
    class="h-10 {isActive ? variants.active : variants.inactive}
    text-sm
	font-normal
  cursor-pointer flex items-center rounded-lg
  transition-all
  active:scale-95"
    href={redirectsTo}
    {rel}
>
    <div class="mx-5 flex items-center">
        {@render children?.()}
    </div>
</a>
