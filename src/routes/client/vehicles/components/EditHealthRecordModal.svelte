<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Label from '$lib/components/common/Label.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';
	import { updateHealthRecord } from '$lib/vehicles/health-records.remote';
	import type { VehicleHealthRecord } from '$lib/server/db/schema';

	interface PartItem {
		name: string;
		status: string;
		description: string;
		cost: number;
	}

	interface Props {
		vehicleId: string;
		record: VehicleHealthRecord | null;
		onClose?: () => void;
		onRecordUpdated?: () => void;
	}

	let { vehicleId, record, onClose = () => {}, onRecordUpdated = () => {} }: Props = $props();

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
		if (record) {
			// Populate form with existing record data
			laborCost = record.laborCost ? parseFloat(record.laborCost) : 0;
			parts = record.partsReplaced ? JSON.parse(JSON.stringify(record.partsReplaced)) : [];
		}
		modalRef.openModal();
	}

	export function closeModal() {
		modalRef.closeModal();
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
		if (updateHealthRecord.result?.success) {
			onRecordUpdated(); // Refresh the records list
			closeModal();
		}
	});

	// Format date for input (YYYY-MM-DD)
	function formatDateForInput(date: Date | string): string {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
</script>

<Modal
	bind:this={modalRef}
	title="Edytuj Wpis w Księdze Zdrowia"
	onDismiss={closeModal}
	classes="bg-gray-900 border border-gray-700 max-w-4xl"
>
	<div class="p-8">
		<form {...updateHealthRecord}>
			<!-- Hidden inputs for dynamic data -->
			<input type="hidden" name="id" value={record?.id || ''} />
			<input type="hidden" name="vehicleId" value={vehicleId} />
			<input type="hidden" name="partsReplaced" value={JSON.stringify(parts)} />
			<input type="hidden" name="laborCost" value={laborCost || 0} />
			<input type="hidden" name="totalCost" value={calculateTotal()} />

			<div class="grid gap-6">
				<!-- Basic Information -->
				<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
					<h3 class="mb-4 text-lg font-semibold text-white">Informacje podstawowe</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Input
								name="title"
								id="title"
								label="Tytuł serwisu"
								placeholder="np. Wymiana oleju i filtra"
								required
								value={record?.title || ''}
								
							/>
						</div>

						<div>
							<Input
								name="serviceDate"
								id="serviceDate"
								label="Data serwisu"
								type="date"
								required
								value={record ? formatDateForInput(record.serviceDate) : ''}
								
							/>
						</div>

						<div>
							<Input
								name="mileage"
								id="mileage"
								label="Przebieg (km)"
								type="number"
								placeholder="75000"
								value={record?.mileage || ''}
								
							/>
						</div>

						<div>
							<Label htmlFor="serviceType">Typ serwisu</Label>
							<Select
								name="serviceType"
								id="serviceType"
								options={serviceTypeOptions}
								value={record?.serviceType || ''}
								classes="mt-2 rounded-xl border border-gray-700 bg-gray-800 text-white"
							/>
						</div>

						<div class="md:col-span-2">
							<Input
								name="serviceProvider"
								id="serviceProvider"
								label="Serwis / Warsztat"
								placeholder="np. AutoSerwis Kowalski"
								value={record?.serviceProvider || ''}
								
							/>
						</div>
					</div>

					<div class="mt-4">
						<Textarea
							name="description"
							id="description"
							label="Opis serwisu"
							rows={3}
							placeholder="Dodatkowe informacje o wykonanych pracach..."
							value={record?.description || ''}
							
						/>
					</div>
				</div>

				<!-- Parts Section -->
				<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-semibold text-white">Wymienione części</h3>
						<Button type="button" variant="outline" onClick={addPart}>Dodaj część</Button>
					</div>

					{#each parts as part, index (index)}
						<div class="mb-4 rounded-lg bg-gray-800 p-4">
							<div class="mb-3 grid grid-cols-1 gap-4 md:grid-cols-4">
								<div>
									<Input
										bind:value={part.name}
										id="part-name-{index}"
										label="Nazwa Części"
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
									<Input
										bind:value={part.cost}
										id="part-cost-{index}"
										label="Koszt (PLN)"
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
								<Input
									bind:value={part.description}
									id="part-description-{index}"
									label="Dodatkowy Opis"
									placeholder="Dlaczego część została wymieniona/naprawiona..."
									classes="focus:ring-opacity-20 mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>
						</div>
					{/each}
				</div>

				<!-- Cost Summary -->
				<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
					<h3 class="mb-4 text-lg font-semibold text-white">Podsumowanie kosztów</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<Input
								bind:value={laborCost}
								name="laborCost"
								id="laborCost"
								label="Koszt Robocizny (PLN)"
								type="number"
								step="0.01"
								placeholder="0.00"
								
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
					<Input
						name="receiptUrl"
						id="receiptUrl"
						label="Link do Paragonu/Faktury"
						type="url"
						placeholder="https://example.com/receipt.pdf"
						value={record?.receiptUrl || ''}
						
					/>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-end space-x-4">
					<Button type="button" variant="outline" onClick={closeModal}>Anuluj</Button>
					<Button type="submit" variant="primary">Zapisz Zmiany</Button>
				</div>

				{#if updateHealthRecord.result?.success}
					<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
						<p class="text-sm text-green-300">Wpis został pomyślnie zaktualizowany!</p>
					</div>
				{:else if updateHealthRecord.result?.error}
					<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
						<p class="text-sm text-red-300">{updateHealthRecord.result.error}</p>
					</div>
				{/if}
			</div>
		</form>
	</div>
</Modal>
