<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { addVehicle } from '$lib/vehicles/data.remote';

	interface Props {
		onClose?: () => void;
	}

	let { onClose = () => {} }: Props = $props();

	let modalRef: Modal;

	// Close modal when form submission succeeds
	$effect(() => {
		if (addVehicle.result?.success) {
			closeModal();
		}
	});

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
	title="Dodaj Nowy Pojazd"
	onDismiss={closeModal}
	classes="bg-gray-900 border border-gray-700"
>
	<div class="p-8">
		<form {...addVehicle}>
			<div class="space-y-6">
				<div>
					<Input
						name="make"
						id="make"
						label="Marka"
						required
						form={addVehicle}
						placeholder="np. Toyota"
					/>
				</div>

				<div>
					<Input
						name="model"
						id="model"
						label="Model"
						required
						form={addVehicle}
						placeholder="np. Corolla"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<Input
						name="year"
						id="year"
						label="Rok Produkcji"
						type="number"
						required
						form={addVehicle}
						placeholder="2023"
					/>
					<Input
						name="vin"
						id="vin"
						label="Numer VIN"
						required
						form={addVehicle}
						placeholder="WBA3A5G50ENP26082"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<Input
						name="licensePlate"
						id="licensePlate"
						label="Numer Rejestracyjny"
						required
						form={addVehicle}
						placeholder="KR 12345"
					/>
					<Input
						name="mileage"
						id="mileage"
						label="Przebieg (km)"
						type="number"
						required
						form={addVehicle}
						placeholder="50000"
					/>
				</div>

				<div>
					<Input
						name="color"
						id="color"
						label="Kolor"
						required
						form={addVehicle}
						placeholder="np. Czerwony"
					/>
				</div>

				<div>
					<Input
						name="model"
						id="model"
						label="Model"
						required
						form={addVehicle}
						placeholder="np. Corolla"
						
					/>
				</div>

				<div>
					<Input
						name="year"
						id="year"
						label="Rocznik"
						type="number"
						required
						form={addVehicle}
						min={1900}
						max={new Date().getFullYear() + 1}
						placeholder={new Date().getFullYear().toString()}
						
					/>
				</div>

				<div>
					<Input
						name="registration"
						id="registration"
						label="Numer Rejestracyjny (opcjonalnie)"
						form={addVehicle}
						placeholder="np. KR ABC123"
						
					/>
				</div>

				<div>
					<Input
						name="vin"
						id="vin"
						label="VIN (opcjonalnie)"
						form={addVehicle}
						placeholder="17-znakowy numer VIN"
						maxlength={17}
						
					/>
				</div>

				<div>
					<Input
						name="color"
						id="color"
						label="Kolor (opcjonalnie)"
						form={addVehicle}
						placeholder="np. Niebieski"
						
					/>
				</div>

				<div>
					<Input
						name="mileage"
						id="mileage"
						label="Aktualny Przebieg (opcjonalnie)"
						type="number"
						form={addVehicle}
						min={0}
						placeholder="np. 50000 km"
						
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
					Dodaj Pojazd
				</Button>
			</div>

			{#if addVehicle.result?.success}
				<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
					<p class="text-sm text-green-300">Pojazd został pomyślnie dodany!</p>
				</div>
			{:else if addVehicle.result?.error}
				<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
					<p class="text-sm text-red-300">{addVehicle.result.error}</p>
				</div>
			{/if}
		</form>
	</div>
</Modal>
