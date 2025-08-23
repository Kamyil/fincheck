<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { deleteVehicle } from '$lib/vehicles/data.remote';
	import type { Vehicle } from '$lib/server/db/schema';

	interface Props {
		vehicle?: Vehicle | null;
		onClose?: () => void;
	}

	let { vehicle = null, onClose = () => {} }: Props = $props();

	let modalRef: Modal;

	export function openModal() {
		modalRef?.openModal();
	}

	export function closeModal() {
		modalRef?.closeModal();
		onClose();
	}
</script>

<Modal
	bind:this={modalRef}
	title="Usuń Pojazd"
	onDismiss={closeModal}
	classes="bg-gray-900 border border-gray-700"
>
	<div class="p-8">
		{#if vehicle}
			<p class="mb-8 text-lg text-gray-300">
				Czy na pewno chcesz usunąć pojazd <strong class="text-white"
					>{vehicle.make} {vehicle.model} ({vehicle.year})</strong
				>? Ta akcja jest nieodwracalna.
			</p>

			<form {...deleteVehicle}>
				<input type="hidden" name="id" value={vehicle.id} />

				<div class="flex justify-end space-x-4">
					<Button
						variant="gray_outline"
						onClick={closeModal}
						classes="font-semibold transition-all duration-300"
					>
						Anuluj
					</Button>
					<Button
						type="submit"
						variant="red"
						classes="transform shadow-lg shadow-red-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-700/25"
					>
						Usuń Pojazd
					</Button>
				</div>

				{#if deleteVehicle.result?.success}
					<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
						<p class="text-sm text-green-300">Pojazd został pomyślnie usunięty!</p>
					</div>
					{closeModal()}
				{:else if deleteVehicle.result?.error}
					<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
						<p class="text-sm text-red-300">{deleteVehicle.result.error}</p>
					</div>
				{/if}
			</form>
		{/if}
	</div>
</Modal>
