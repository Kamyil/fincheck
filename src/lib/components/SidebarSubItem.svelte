<script lang="ts">
  interface Props {
    isActive?: boolean;
    redirectsTo: `/${string}`;
    children?: import('svelte').Snippet;
  }

  let { isActive = false, redirectsTo, children }: Props = $props();

    let variants = {
        active: "text-primary bg-zinc-50",
        inactive: "text-gray-500 hover:bg-zinc-50",
    } as const;
</script>

<a
    class="h-10 {isActive ? variants.active : variants.inactive}
  my-2 text-sm
  cursor-pointer flex justify-start items-center rounded:lg
  transition-all rounded-lg hover:shadow-md
  active:scale-95
	font-normal
"
    href={redirectsTo}
>
    <div class="ml-[3.20rem]">
        {@render children?.()}
    </div>
</a>
