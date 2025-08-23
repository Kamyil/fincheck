<script lang="ts">
	interface Props {
		isActive?: boolean;
		redirectsTo: `/${string}`;
		children?: import('svelte').Snippet;
	}

	let { isActive = false, redirectsTo, children }: Props = $props();

	let variants = {
		active: 'text-primary bg-zinc-50',
		inactive: 'text-gray-500 hover:bg-zinc-50'
	} as const;
</script>

<a
	class="h-10 {isActive ? variants.active : variants.inactive}
  rounded:lg my-2
  flex cursor-pointer items-center justify-start rounded-lg
  text-sm font-normal transition-all
  hover:shadow-md
	active:scale-95
"
	href={redirectsTo}
>
	<div class="ml-[3.20rem]">
		{@render children?.()}
	</div>
</a>
