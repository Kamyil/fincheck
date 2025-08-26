<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
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
						<Input
							name="make"
							id="edit-make"
							label="Marka"
							required
							form={updateVehicle}
							value={vehicle.make}
							
						/>
					</div>

					<div>
						<Input
							name="model"
							id="edit-model"
							label="Model"
							required
							form={updateVehicle}
							value={vehicle.model}
							
						/>
					</div>

					<div>
						<Input
							name="year"
							id="edit-year"
							label="Rocznik"
							type="number"
							required
							form={updateVehicle}
							min={1900}
							max={new Date().getFullYear() + 1}
							value={vehicle.year}
							
						/>
					</div>

					<div>
						<Input
							name="registration"
							id="edit-registration"
							label="Numer Rejestracyjny (opcjonalnie)"
							form={updateVehicle}
							value={vehicle.registration || ''}
							
						/>
					</div>

					<div>
						<Input
							name="vin"
							id="edit-vin"
							label="VIN (opcjonalnie)"
							form={updateVehicle}
							maxlength={17}
							value={vehicle.vin || ''}
							
						/>
					</div>

					<div>
						<Input
							name="color"
							id="edit-color"
							label="Kolor (opcjonalnie)"
							form={updateVehicle}
							value={vehicle.color || ''}
							
						/>
					</div>

					<div>
						<Input
							name="mileage"
							id="edit-mileage"
							label="Aktualny Przebieg (opcjonalnie)"
							type="number"
							form={updateVehicle}
							min={0}
							value={vehicle.mileage || ''}
							
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
