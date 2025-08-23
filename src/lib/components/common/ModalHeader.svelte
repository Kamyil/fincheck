<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		onClose?: () => void;
		children?: import('svelte').Snippet;
	}

	let { onClose = () => history.back(), children }: Props = $props();

	const handleClose = () => {
		onClose();
	};
</script>

<div class="flex items-center p-4">
	<h2 class="self-center text-lg font-bold">
		{@render children?.()}
	</h2>
	<Button onClick={handleClose} variant="close" classes="ml-auto">
		<span class="text-2xl">&times;</span>
	</Button>
</div>
