<script lang="ts">
	import Car from 'lucide-svelte/icons/car';
	import Button from '$lib/components/common/Button.svelte';
	import VehicleCard from '$lib/components/VehicleCard.svelte';
	import AddVehicleModal from './components/AddVehicleModal.svelte';
	import EditVehicleModal from './components/EditVehicleModal.svelte';
	import DeleteVehicleModal from './components/DeleteVehicleModal.svelte';
	import { getUserVehicles } from '$lib/vehicles/data.remote';
	import type { Vehicle } from '$lib/server/db/schema';
	import { goto } from '$app/navigation';

	let selectedVehicle = $state<Vehicle | null>(null);
	let addModal: AddVehicleModal;
	let editModal: EditVehicleModal;
	let deleteModal: DeleteVehicleModal;

	function openAddModal() {
		addModal?.openModal();
	}

	function openEditModal(vehicle: Vehicle) {
		selectedVehicle = vehicle;
		editModal?.openModal();
	}

	function openDeleteModal(vehicle: Vehicle) {
		selectedVehicle = vehicle;
		deleteModal?.openModal();
	}

	function closeModals() {
		addModal?.closeModal();
		editModal?.closeModal();
		deleteModal?.closeModal();
		selectedVehicle = null;
	}

	function viewVehicleDetails(vehicle: Vehicle) {
		goto(`/client/vehicles/${vehicle.id}`);
	}
</script>

<svelte:head>
	<title>Twoje Pojazdy - Pan Samochodzik</title>
	<meta
		name="description"
		content="Zarządzaj swoimi pojazdami w Pan Samochodzik - Twój Cyfrowy Asystent Motoryzacyjny"
	/>
</svelte:head>

<!-- Modals -->
<AddVehicleModal bind:this={addModal} onClose={closeModals} />
<EditVehicleModal bind:this={editModal} vehicle={selectedVehicle} onClose={closeModals} />
<DeleteVehicleModal bind:this={deleteModal} vehicle={selectedVehicle} onClose={closeModals} />
<!-- End of Modals -->

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
>
	<!-- Asphalt texture overlay -->
	<div
		class="absolute inset-0 opacity-10"
		style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0); background-size: 20px 20px;"
	></div>
	<!-- Lane stripes -->
	<div class="absolute inset-0 opacity-20">
		<div class="absolute top-1/4 right-0 left-0 h-1 -skew-y-1 transform bg-white"></div>
		<div class="absolute top-2/4 right-0 left-0 h-1 skew-y-1 transform bg-white"></div>
		<div class="absolute top-3/4 right-0 left-0 h-1 -skew-y-1 transform bg-white"></div>
	</div>

	<!-- Navigation -->
	<nav class="relative z-10 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<a href="/" class="flex items-center space-x-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/25"
				>
					<Car class="h-6 w-6 text-white" />
				</div>
				<span class="text-2xl font-bold text-white">Pan Samochodzik</span>
			</a>
		</div>
	</nav>

	<svelte:boundary>
		<!-- Main Content -->
		<section class="relative z-10 mx-4 px-4 py-8 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
			<div class="mx-auto max-w-6xl">
				<div class="mb-8 flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full border border-red-600 bg-red-600/20"
						>
							<Car class="h-8 w-8 text-red-400" />
						</div>
						<div>
							<h1 class="text-3xl font-bold text-white">Twoje Pojazdy</h1>
							<p class="text-gray-400">Zarządzaj swoimi samochodami i ich historią serwisową</p>
						</div>
					</div>
					<Button
						variant="red"
						onClick={openAddModal}
						classes="transform shadow-lg shadow-red-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-700/25"
					>
						Dodaj Pojazd
					</Button>
				</div>

				{#key await getUserVehicles().current}
					{#if await getUserVehicles()}
						<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{#each await getUserVehicles() as vehicle}
								<VehicleCard
									{vehicle}
									onView={viewVehicleDetails}
									onEdit={openEditModal}
									onDelete={openDeleteModal}
								/>
							{/each}
						</div>
					{:else}
						<div
							class="rounded-2xl border border-gray-700 bg-gray-900/50 p-12 text-center shadow-2xl shadow-red-600/10"
						>
							<div
								class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-600 bg-red-600/20"
							>
								<Car class="h-10 w-10 text-red-400" />
							</div>
							<h3 class="mb-4 text-2xl font-semibold text-white">Jeszcze nie masz pojazdów</h3>
							<p class="mb-8 text-lg text-gray-400">
								Dodaj swój pierwszy pojazd, aby rozpocząć śledzenie jego historii serwisowej i
								potrzeb motoryzacyjnych.
							</p>
							<Button
								variant="red"
								onClick={openAddModal}
								classes="transform shadow-lg shadow-red-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-700/25"
							>
								Dodaj Pierwszy Pojazd
							</Button>
						</div>
					{/if}
				{/key}
			</div>
		</section>

		{#snippet pending()}
			<div class="container mx-auto flex items-center justify-center p-8">
				<div
					class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"
				></div>
			</div>
		{/snippet}
	</svelte:boundary>
</div>
