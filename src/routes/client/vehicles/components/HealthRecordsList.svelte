<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import type { VehicleHealthRecord } from '$lib/server/db/schema';

	interface Props {
		records: VehicleHealthRecord[];
		onEdit?: (record: VehicleHealthRecord) => void;
		onDelete?: (record: VehicleHealthRecord) => void;
	}

	let { records, onEdit = () => {}, onDelete = () => {} }: Props = $props();

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatCurrency(amount: string | null): string {
		if (!amount) return '0,00 PLN';
		return (
			parseFloat(amount).toLocaleString('pl-PL', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}) + ' PLN'
		);
	}

	function getStatusLabel(status: string): string {
		const statusMap: Record<string, string> = {
			CHANGED: 'Wymieniona',
			REPAIRED: 'Naprawiona',
			REPLACED: 'Zastąpiona',
			ADJUSTED: 'Wyregulowana',
			CLEANED: 'Oczyszczona',
			INSPECTED: 'Sprawdzona'
		};
		return statusMap[status] || status;
	}

	function getStatusColor(status: string): string {
		const colorMap: Record<string, string> = {
			CHANGED: 'bg-blue-600',
			REPAIRED: 'bg-green-600',
			REPLACED: 'bg-orange-600',
			ADJUSTED: 'bg-purple-600',
			CLEANED: 'bg-cyan-600',
			INSPECTED: 'bg-yellow-600'
		};
		return colorMap[status] || 'bg-gray-600';
	}
</script>

<div class="space-y-6">
	{#if records.length === 0}
		<Card classes="bg-gray-800 border-gray-700">
			<div class="p-8 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-700"
				>
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-white">Brak wpisów w księdze zdrowia</h3>
				<p class="text-gray-400">
					Dodaj pierwszy wpis, aby rozpocząć śledzenie historii serwisowej pojazdu.
				</p>
			</div>
		</Card>
	{:else}
		{#each records as record (record.id)}
			<Card classes="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
				<div class="p-6">
					<!-- Header -->
					<div class="mb-4 flex items-start justify-between">
						<div>
							<h3 class="mb-1 text-lg font-semibold text-white">{record.title}</h3>
							<div class="flex items-center space-x-4 text-sm text-gray-400">
								<span>📅 {formatDate(record.serviceDate)}</span>
								{#if record.mileage}
									<span>🏃 {record.mileage.toLocaleString('pl-PL')} km</span>
								{/if}
								{#if record.serviceType}
									<span class="rounded-full bg-gray-700 px-2 py-1 text-gray-300"
										>{record.serviceType}</span
									>
								{/if}
							</div>
						</div>
						<div class="flex space-x-2">
							<Button
								variant="gray_outline"
								onClick={() => onEdit(record)}
								classes="text-xs px-3 py-1"
							>
								Edytuj
							</Button>
							<Button variant="red" onClick={() => onDelete(record)} classes="text-xs px-3 py-1">
								Usuń
							</Button>
						</div>
					</div>

					<!-- Description -->
					{#if record.description}
						<div class="mb-4">
							<p class="text-sm text-gray-300">{record.description}</p>
						</div>
					{/if}

					<!-- Parts -->
					{#if record.partsReplaced && Array.isArray(record.partsReplaced) && record.partsReplaced.length > 0}
						<div class="mb-4">
							<h4 class="mb-2 text-sm font-medium text-white">Części:</h4>
							<div class="space-y-2">
								{#each record.partsReplaced as part}
									<div class="flex items-center justify-between rounded-lg bg-gray-700 p-3">
										<div class="flex items-center space-x-3">
											<span class="font-medium text-white">{part.name}</span>
											<span
												class="inline-flex items-center rounded-full px-2 py-1 text-xs text-white {getStatusColor(
													part.status
												)}"
											>
												{getStatusLabel(part.status)}
											</span>
										</div>
										{#if part.cost}
											<span class="text-sm text-gray-300"
												>{formatCurrency(part.cost.toString())}</span
											>
										{/if}
									</div>
									{#if part.description}
										<p class="ml-3 text-xs text-gray-400">{part.description}</p>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					<!-- Service Provider -->
					{#if record.serviceProvider}
						<div class="mb-4">
							<p class="text-sm text-gray-400">
								🔧 Wykonawca: <span class="text-gray-300">{record.serviceProvider}</span>
							</p>
						</div>
					{/if}

					<!-- Costs -->
					<div class="border-t border-gray-700 pt-4">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
							{#if record.laborCost}
								<div>
									<p class="text-xs tracking-wide text-gray-400 uppercase">Robocizna</p>
									<p class="text-sm font-medium text-white">{formatCurrency(record.laborCost)}</p>
								</div>
							{/if}

							{#if record.partsReplaced && Array.isArray(record.partsReplaced)}
								{@const partsCost = record.partsReplaced.reduce(
									(sum, part) => sum + (part.cost || 0),
									0
								)}
								{#if partsCost > 0}
									<div>
										<p class="text-xs tracking-wide text-gray-400 uppercase">Części</p>
										<p class="text-sm font-medium text-white">
											{formatCurrency(partsCost.toString())}
										</p>
									</div>
								{/if}
							{/if}

							{#if record.totalCost}
								<div>
									<p class="text-xs tracking-wide text-gray-400 uppercase">Razem</p>
									<p class="text-lg font-semibold text-red-400">
										{formatCurrency(record.totalCost)}
									</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Receipt Link -->
					{#if record.receiptUrl}
						<div class="mt-4 border-t border-gray-700 pt-4">
							<a
								href={record.receiptUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center text-sm text-red-400 transition-colors hover:text-red-300"
							>
								🧾 Zobacz paragon/fakturę
								<svg class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</div>
					{/if}

					<!-- Created Date -->
					<div class="mt-4 text-xs text-gray-500">
						Dodano: {formatDate(record.createdAt)}
						{#if record.updatedAt && record.updatedAt.getTime() !== record.createdAt.getTime()}
							• Zaktualizowano: {formatDate(record.updatedAt)}
						{/if}
					</div>
				</div>
			</Card>
		{/each}
	{/if}
</div>
