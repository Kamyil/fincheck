<script lang="ts">
	import Grid from '$lib/components/common/layout/Grid.svelte';
	import Column from '$lib/components/common/layout/Column.svelte';
	import Section from '$lib/components/common/Section.svelte';

	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<Grid>
	<Column size="12">
		<Section>
			<div class="flex place-content-between items-center">
				<button class="ml-auto text-gray-500" onclick={() => history.back()}>
					<span class="text-2xl">&times;</span>
				</button>
			</div>

			<div class="m-40 text-center text-red-500">
				{message}
			</div>
		</Section>
	</Column>
</Grid>
