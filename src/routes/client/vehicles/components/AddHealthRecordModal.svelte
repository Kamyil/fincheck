<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Label from '$lib/components/common/Label.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import { addHealthRecord } from '$lib/vehicles/health-records.remote';

	interface PartItem {
		name: string;
		status: string;
		description: string;
		cost: number;
	}

	interface Props {
		vehicleId: string;
		onClose?: () => void;
		onRecordAdded?: () => void;
	}

	let { vehicleId, onClose = () => {}, onRecordAdded = () => {} }: Props = $props();

	let modalRef: Modal;
	let parts: PartItem[] = $state([]);
	let laborCost: number = $state(0);

	// Service type options
	let serviceTypeOptions = [
		{ label: 'Przegląd', value: 'Inspection' },
		{ label: 'Naprawa', value: 'Repair' },
		{ label: 'Konserwacja', value: 'Maintenance' },
		{ label: 'Wymiana oleju', value: 'Oil Change' },
		{ label: 'Wymiana części', value: 'Parts Replacement' },
		{ label: 'Diagnostyka', value: 'Diagnostics' },
		{ label: 'Inne', value: 'Other' }
	];

	// Part status options
	let partStatusOptions = [
		{ label: 'Wymieniona', value: 'CHANGED' },
		{ label: 'Naprawiona', value: 'REPAIRED' },
		{ label: 'Zastąpiona inną', value: 'REPLACED' },
		{ label: 'Wyregulowana', value: 'ADJUSTED' },
		{ label: 'Oczyszczona', value: 'CLEANED' },
		{ label: 'Sprawdzona', value: 'INSPECTED' }
	];

	export function openModal() {
		modalRef?.openModal();
	}

	export function closeModal() {
		modalRef?.closeModal();
		// Reset form data
		parts = [];
		laborCost = 0;
		onClose();
	}

	function addPart() {
		parts = [...parts, { name: '', status: 'CHANGED', description: '', cost: 0 }];
	}

	function removePart(index: number) {
		parts = parts.filter((_, i) => i !== index);
	}

	function calculateTotal() {
		let partsCost = parts.reduce((sum, part) => sum + (part.cost || 0), 0);
		return partsCost + (laborCost || 0);
	}

	// Close modal when form submission is successful
	$effect(() => {
		if (addHealthRecord.result?.success) {
			onRecordAdded(); // Refresh the records list
			closeModal();
		}
	});
</script>

<Modal
	bind:this={modalRef}
	title="Dodaj Wpis do Księgi Zdrowia"
	onDismiss={closeModal}
	classes="bg-gray-900 border border-gray-700 max-w-4xl"
>
	<div class="p-8">
		<form {...addHealthRecord}>
			<!-- Hidden inputs for dynamic data -->
			<input type="hidden" name="vehicleId" value={vehicleId} />
			<input type="hidden" name="partsReplaced" value={JSON.stringify(parts)} />
			<input type="hidden" name="laborCost" value={laborCost || 0} />
			<input type="hidden" name="totalCost" value={calculateTotal()} />
			>
			<div class="space-y-6">
				<!-- Basic Information -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<Label htmlFor="title">Tytuł Serwisu *</Label>
						<Input
							name="title"
							id="title"
							required
							placeholder="np. Wymiana oleju silnikowego"
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>

					<div>
						<Label htmlFor="serviceDate">Data Serwisu *</Label>
						<Input
							name="serviceDate"
							id="serviceDate"
							type="date"
							required
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<Label htmlFor="serviceType">Typ Serwisu</Label>
						<Select
							name="serviceType"
							id="serviceType"
							options={serviceTypeOptions}
							placeholder="Wybierz typ serwisu"
							classes="mt-2 rounded-xl border border-gray-700 bg-gray-800 text-white"
						/>
					</div>

					<div>
						<Label htmlFor="mileage">Przebieg (km)</Label>
						<Input
							name="mileage"
							id="mileage"
							type="number"
							min={0}
							placeholder="np. 75000"
							classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<Label htmlFor="serviceProvider">Dostawca Usług</Label>
					<Input
						name="serviceProvider"
						id="serviceProvider"
						placeholder="np. AutoSerwis Kowalski lub DIY"
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<Label htmlFor="description">Opis</Label>
					<Textarea
						name="description"
						id="description"
						placeholder="Szczegółowy opis wykonanych prac..."
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
						rows={3}
					/>
				</div>

				<!-- Parts Section -->
				<div class="border-t border-gray-700 pt-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-medium text-white">Części</h3>
						<Button type="button" variant="green" onClick={addPart}>Dodaj Część</Button>
					</div>

					{#each parts as part, index (index)}
						<div class="mb-4 rounded-lg bg-gray-800 p-4">
							<div class="mb-3 grid grid-cols-1 gap-4 md:grid-cols-4">
								<div>
									<Label htmlFor="part-name-{index}">Nazwa Części</Label>
									<Input
										bind:value={part.name}
										id="part-name-{index}"
										placeholder="np. Filtr oleju"
										classes="focus:ring-opacity-20 mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
									/>
								</div>

								<div>
									<Label htmlFor="part-status-{index}">Status</Label>
									<Select
										bind:value={part.status}
										id="part-status-{index}"
										options={partStatusOptions}
										classes="mt-1 rounded-lg border border-gray-600 bg-gray-700 text-white"
									/>
								</div>

								<div>
									<Label htmlFor="part-cost-{index}">Koszt (PLN)</Label>
									<Input
										bind:value={part.cost}
										id="part-cost-{index}"
										type="number"
										step="0.01"
										placeholder="0.00"
										classes="focus:ring-opacity-20 mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
									/>
								</div>

								<div class="flex items-end">
									<Button
										type="button"
										variant="red"
										onClick={() => removePart(index)}
										classes="mb-1"
									>
										Usuń
									</Button>
								</div>
							</div>

							<div>
								<Label htmlFor="part-description-{index}">Dodatkowy Opis</Label>
								<Input
									bind:value={part.description}
									id="part-description-{index}"
									placeholder="Dlaczego część została wymieniona/naprawiona..."
									classes="focus:ring-opacity-20 mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>
						</div>
					{/each}
				</div>

				<!-- Costs Section -->
				<div class="border-t border-gray-700 pt-6">
					<h3 class="mb-4 text-lg font-medium text-white">Koszty</h3>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div>
							<Label htmlFor="laborCost">Koszt Robocizny (PLN)</Label>
							<Input
								bind:value={laborCost}
								name="laborCost"
								id="laborCost"
								type="number"
								step="0.01"
								placeholder="0.00"
								classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
							/>
						</div>

						<div>
							<Label>Koszt Części (PLN)</Label>
							<div class="mt-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white">
								{parts.reduce((sum, part) => sum + (part.cost || 0), 0).toFixed(2)}
							</div>
						</div>

						<div>
							<Label>Całkowity Koszt (PLN)</Label>
							<div
								class="mt-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-medium text-white"
							>
								{calculateTotal().toFixed(2)}
							</div>
						</div>
					</div>
				</div>

				<div>
					<Label htmlFor="receiptUrl">Link do Paragonu/Faktury</Label>
					<Input
						name="receiptUrl"
						id="receiptUrl"
						type="url"
						placeholder="https://..."
						classes="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
					/>
				</div>
			</div>

			<div class="mt-8 flex justify-end space-x-4">
				<Button
					type="button"
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
					Dodaj Wpis
				</Button>
			</div>

			{#if addHealthRecord.result?.success}
				<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
					<p class="text-sm text-green-300">Wpis został pomyślnie dodany do księgi zdrowia!</p>
				</div>
			{:else if addHealthRecord.result?.error}
				<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
					<p class="text-sm text-red-300">{addHealthRecord.result.error}</p>
				</div>
			{/if}
		</form>
	</div>
</Modal>
