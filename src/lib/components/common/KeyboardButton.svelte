<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<kbd
	class="h-8 max-w-fit rounded-lg border
  border-gray-200 bg-gray-100 px-2 py-1.5 text-xs
  font-semibold text-gray-800
  dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
>
	{@render children?.()}
</kbd>
