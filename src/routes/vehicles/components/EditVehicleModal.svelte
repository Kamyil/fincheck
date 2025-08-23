<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Label from '$lib/components/common/Label.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { updateVehicle } from '$lib/vehicles/data.remote';
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
	title="Edytuj Pojazd"
	onDismiss={closeModal}
	classes="bg-gray-900 border border-gray-700"
>
	<div class="p-8">
		{#if vehicle}
			<form {...updateVehicle}>
				<input type="hidden" name="id" value={vehicle.id} />
				<div class="space-y-6">
					<div>
						<Label htmlFor="edit-make">Marka</Label>
						<Input
							name="make"
							id="edit-make"
							required
							value={vehicle.make}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="edit-model">Model</Label>
						<Input
							name="model"
							id="edit-model"
							required
							value={vehicle.model}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="edit-year">Rocznik</Label>
						<Input
							name="year"
							id="edit-year"
							type="number"
							required
							min={1900}
							max={new Date().getFullYear() + 1}
							value={vehicle.year}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="edit-registration">Numer Rejestracyjny (opcjonalnie)</Label>
						<Input
							name="registration"
							id="edit-registration"
							value={vehicle.registration || ''}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="edit-vin">VIN (opcjonalnie)</Label>
						<Input
							name="vin"
							id="edit-vin"
							maxlength={17}
							value={vehicle.vin || ''}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="edit-color">Kolor (opcjonalnie)</Label>
						<Input
							name="color"
							id="edit-color"
							value={vehicle.color || ''}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="edit-mileage">Aktualny Przebieg (opcjonalnie)</Label>
						<Input
							name="mileage"
							id="edit-mileage"
							type="number"
							min={0}
							value={vehicle.mileage || ''}
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>
				</div>

				<div class="mt-8 flex justify-end space-x-4">
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
						Zaktualizuj Pojazd
					</Button>
				</div>

				{#if updateVehicle.result?.success}
					<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
						<p class="text-sm text-green-300">Pojazd został pomyślnie zaktualizowany!</p>
					</div>
					{closeModal()}
				{:else if updateVehicle.result?.error}
					<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
						<p class="text-sm text-red-300">{updateVehicle.result.error}</p>
					</div>
				{/if}
			</form>
		{/if}
	</div>
</Modal>
