<script lang="ts">
	import BarChart from '$lib/components/common/Charts/BarChart.svelte';
	import DoughnutChart from '$lib/components/common/Charts/DoughnutChart.svelte';
	import PieChart from '$lib/components/common/Charts/PieChart.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import TrendingUpIcon from 'lucide-svelte/icons/trending-up';
	import DollarSignIcon from 'lucide-svelte/icons/dollar-sign';
	import WrenchIcon from 'lucide-svelte/icons/wrench';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { VehicleHealthRecord } from '$lib/server/db/schema';

	interface Props {
		records: VehicleHealthRecord[];
	}

	let { records }: Props = $props();

	// Debug: Check if props are received
	$effect(() => {
		console.log('VehicleHealthAnalytics received records:', records);
		console.log('Records length:', records?.length);
	});

	// Calculate analytics from health records
	let analytics = $derived(() => {
		console.log('Analytics calculation - records received:', records);
		console.log('Records length:', records?.length);
		if (!records || !records.length) {
			console.log('No records found, returning null');
			return null;
		}

		// Cost trend over time (chronological by service)
		let costByService = [];
		let servicesByType = new Map<string, number>();
		let totalCost = 0;
		let totalServices = records.length;

		// Sort records chronologically first
		let sortedRecords = records.sort(
			(a, b) => new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime()
		);

		sortedRecords.forEach((record, index) => {
			let cost = record.totalCost ? parseFloat(record.totalCost.toString()) : 0;
			console.log(
				`Record ${index + 1}: ${record.title}, cost string: "${record.totalCost}", parsed cost:`,
				cost
			);
			totalCost += cost;

			// Service progression
			costByService.push({
				label: `Serwis ${index + 1}`,
				date: new Date(record.serviceDate).toLocaleDateString('pl-PL'),
				cost: cost,
				title: record.title
			});

			// Service type aggregation
			let serviceType = record.serviceType || 'Inne';
			servicesByType.set(serviceType, (servicesByType.get(serviceType) || 0) + 1);
		});

		// Cost trend chart data
		let costTrendData = {
			labels: costByService.map((service) => service.label),
			datasets: [
				{
					label: 'Koszt serwisu (PLN)',
					data: costByService.map((service) => service.cost),
					backgroundColor: 'rgba(239, 68, 68, 0.6)',
					borderColor: 'rgba(239, 68, 68, 1)',
					borderWidth: 2
				}
			]
		};

		// Service types pie chart data
		let serviceTypeData = {
			labels: Array.from(servicesByType.keys()),
			datasets: [
				{
					data: Array.from(servicesByType.values()),
					backgroundColor: [
						'rgba(239, 68, 68, 0.8)',
						'rgba(34, 197, 94, 0.8)',
						'rgba(59, 130, 246, 0.8)',
						'rgba(245, 158, 11, 0.8)',
						'rgba(168, 85, 247, 0.8)',
						'rgba(236, 72, 153, 0.8)'
					],
					borderColor: [
						'rgba(239, 68, 68, 1)',
						'rgba(34, 197, 94, 1)',
						'rgba(59, 130, 246, 1)',
						'rgba(245, 158, 11, 1)',
						'rgba(168, 85, 247, 1)',
						'rgba(236, 72, 153, 1)'
					],
					borderWidth: 1
				}
			]
		};

		// Calculate average cost per service
		let averageCost = totalServices > 0 ? totalCost / totalServices : 0;

		// Get most recent service
		let mostRecentService = records.sort(
			(a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
		)[0];

		// Calculate days since last service
		let daysSinceLastService = mostRecentService
			? Math.floor(
					(new Date().getTime() - new Date(mostRecentService.serviceDate).getTime()) /
						(1000 * 60 * 60 * 24)
				)
			: 0;

		let result = {
			costTrendData,
			serviceTypeData,
			totalCost,
			totalServices,
			averageCost,
			daysSinceLastService,
			mostRecentService
		};

		console.log('Analytics result:', result);
		return result;
	});

	let chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				labels: {
					color: 'rgba(255, 255, 255, 0.7)'
				}
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					color: 'rgba(255, 255, 255, 0.7)'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)'
				}
			},
			x: {
				ticks: {
					color: 'rgba(255, 255, 255, 0.7)'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)'
				}
			}
		}
	};

	let pieChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					color: 'rgba(255, 255, 255, 0.7)',
					padding: 20
				}
			}
		}
	};
</script>

<!-- Debug info -->
<div class="mb-4 rounded border border-yellow-600 bg-yellow-900/20 p-4">
	<h3 class="font-semibold text-yellow-400">Debug Info:</h3>
	<p class="text-yellow-200">Records received: {records?.length || 'undefined'}</p>
	<p class="text-yellow-200">Analytics calculated: {analytics ? 'yes' : 'no'}</p>
	{#if records?.length}
		<p class="text-yellow-200">First record cost: {records[0]?.totalCost}</p>
		<p class="text-yellow-200">Sample record: {JSON.stringify(records[0], null, 2)}</p>
	{/if}
</div>

{#if analytics}
	<div class="space-y-8">
		<!-- Summary Stats -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card classes="bg-gray-900/50 border-gray-700 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
						<DollarSignIcon class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-2xl font-bold text-white">
							{analytics?.totalCost?.toLocaleString('pl-PL', {
								style: 'currency',
								currency: 'PLN',
								minimumFractionDigits: 0
							}) || '0 PLN'}
						</h3>
						<p class="text-gray-400">Łączny koszt serwisu</p>
					</div>
				</div>
			</Card>

			<Card classes="bg-gray-900/50 border-gray-700 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
						<WrenchIcon class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-2xl font-bold text-white">{analytics?.totalServices || 0}</h3>
						<p class="text-gray-400">Liczba serwisów</p>
					</div>
				</div>
			</Card>

			<Card classes="bg-gray-900/50 border-gray-700 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
						<TrendingUpIcon class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-2xl font-bold text-white">
							{analytics?.averageCost?.toLocaleString('pl-PL', {
								style: 'currency',
								currency: 'PLN',
								minimumFractionDigits: 0
							}) || '0 PLN'}
						</h3>
						<p class="text-gray-400">Średni koszt serwisu</p>
					</div>
				</div>
			</Card>

			<Card classes="bg-gray-900/50 border-gray-700 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600">
						<CalendarIcon class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-2xl font-bold text-white">{analytics?.daysSinceLastService || 0}</h3>
						<p class="text-gray-400">Dni od ostatniego serwisu</p>
					</div>
				</div>
			</Card>
		</div>

		<!-- Charts -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Cost Trend Chart -->
			<Card classes="bg-gray-900/50 border-gray-700 p-6">
				<h3 class="mb-4 text-lg font-semibold text-white">Koszty serwisu w czasie</h3>
				<div class="h-64">
					{#if analytics?.costTrendData}
						<BarChart data={analytics.costTrendData} options={chartOptions} />
					{/if}
				</div>
			</Card>

			<!-- Service Types Chart -->
			<Card classes="bg-gray-900/50 border-gray-700 p-6">
				<h3 class="mb-4 text-lg font-semibold text-white">Rodzaje serwisów</h3>
				<div class="h-64">
					{#if analytics?.serviceTypeData}
						<PieChart data={analytics.serviceTypeData} options={pieChartOptions} />
					{/if}
				</div>
			</Card>
		</div>

		<!-- Maintenance Alerts -->
		{#if analytics?.daysSinceLastService && analytics.daysSinceLastService > 180}
			<Card classes="bg-yellow-900/20 border-yellow-600 p-6">
				<div class="flex items-start space-x-3">
					<div class="flex h-6 w-6 items-center justify-center">
						<CalendarIcon class="h-5 w-5 text-yellow-400" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-yellow-400">Przypomnienie o serwisie</h3>
						<p class="text-yellow-300">
							Minęło już {analytics?.daysSinceLastService || 0} dni od ostatniego serwisu. Rozważ umówienie
							się na przegląd.
						</p>
					</div>
				</div>
			</Card>
		{:else if analytics?.daysSinceLastService && analytics.daysSinceLastService > 90}
			<Card classes="bg-blue-900/20 border-blue-600 p-6">
				<div class="flex items-start space-x-3">
					<div class="flex h-6 w-6 items-center justify-center">
						<CalendarIcon class="h-5 w-5 text-blue-400" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-blue-400">Informacja</h3>
						<p class="text-blue-300">
							Ostatni serwis był {analytics?.daysSinceLastService || 0} dni temu. Pojazd jest w dobrym
							stanie serwisowym.
						</p>
					</div>
				</div>
			</Card>
		{/if}
	</div>
{:else}
	<Card classes="bg-gray-900/50 border-gray-700 p-12 text-center">
		<div
			class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-600 bg-gray-800"
		>
			<TrendingUpIcon class="h-8 w-8 text-gray-400" />
		</div>
		<h3 class="mb-2 text-xl font-semibold text-white">Brak danych do analizy</h3>
		<p class="text-gray-400">
			Dodaj wpisy do księgi zdrowia, aby zobaczyć analizy i statystyki dotyczące Twojego pojazdu.
		</p>
	</Card>
{/if}
