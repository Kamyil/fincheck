<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import Section from '$lib/components/common/Section.svelte';

	let showModal = $state(false);

	interface Props {
		link: string;
	}

	let { link }: Props = $props();
</script>

<div class="absolute top-0 right-0">
	<Button
		variant="neutral"
		classes="bg-white text-zinc-500 z-[21] hover:text-primary"
		onClick={() => {
			showModal = !showModal;
		}}
	>
		help - {link}
	</Button>
</div>

{#if showModal}
	<Modal
		title="Pomoc"
		classes="w-full md:w-[70%] max-h-full overflow-auto p-0"
		beforeClose={() => {
			return { shouldCloseModal: true };
		}}
	>
		<Section>
			{link}
		</Section>
	</Modal>
{/if}
