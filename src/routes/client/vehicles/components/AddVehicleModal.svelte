<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Label from '$lib/components/common/Label.svelte';
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
					<Label htmlFor="make">Marka</Label>
					<Input
						name="make"
						id="make"
						required
						form={addVehicle}
						placeholder="np. Toyota"
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="model">Model</Label>
					<Input
						name="model"
						id="model"
						required
						form={addVehicle}
						placeholder="np. Corolla"
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="year">Rocznik</Label>
					<Input
						name="year"
						id="year"
						type="number"
						required
						form={addVehicle}
						min={1900}
						max={new Date().getFullYear() + 1}
						placeholder={new Date().getFullYear().toString()}
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="registration">Numer Rejestracyjny (opcjonalnie)</Label>
					<Input
						name="registration"
						id="registration"
						form={addVehicle}
						placeholder="np. KR ABC123"
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="vin">VIN (opcjonalnie)</Label>
					<Input
						name="vin"
						id="vin"
						form={addVehicle}
						placeholder="17-znakowy numer VIN"
						maxlength={17}
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="color">Kolor (opcjonalnie)</Label>
					<Input
						name="color"
						id="color"
						form={addVehicle}
						placeholder="np. Niebieski"
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="mileage">Aktualny Przebieg (opcjonalnie)</Label>
					<Input
						name="mileage"
						id="mileage"
						type="number"
						form={addVehicle}
						min={0}
						placeholder="np. 50000 km"
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
