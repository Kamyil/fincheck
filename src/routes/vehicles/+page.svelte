<script lang="ts">
	import Car from 'lucide-svelte/icons/car';
	import Button from '$lib/components/common/Button.svelte';
	import Table from '$lib/components/common/Table/Table.svelte';
	import TableHeader from '$lib/components/common/Table/TableHeader.svelte';
	import TableBody from '$lib/components/common/Table/TableBody.svelte';
	import TableRow from '$lib/components/common/Table/TableRow.svelte';
	import TableCell from '$lib/components/common/Table/TableCell.svelte';
	import TableHeading from '$lib/components/common/Table/TableHeading.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Label from '$lib/components/common/Label.svelte';
	import {
		getUserVehicles,
		addVehicle,
		updateVehicle,
		deleteVehicle
	} from '$lib/vehicles/data.remote';
	import type { Vehicle } from '$lib/server/db/schema';

	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let selectedVehicle = $state<Vehicle | null>(null);

	function openAddModal() {
		showAddModal = true;
	}

	function openEditModal(vehicle: Vehicle) {
		selectedVehicle = vehicle;
		showEditModal = true;
	}

	function openDeleteModal(vehicle: Vehicle) {
		selectedVehicle = vehicle;
		showDeleteModal = true;
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		showDeleteModal = false;
		selectedVehicle = null;
	}
</script>

<svelte:head>
	<title>Twoje Pojazdy - Pan Samochodzik</title>
	<meta
		name="description"
		content="Zarządzaj swoimi pojazdami w Pan Samochodzik - Twój Cyfrowy Asystent Motoryzacyjny"
	/>
</svelte:head>

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
	<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
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

				{#key getUserVehicles().current}
					{#if await getUserVehicles()}
						<div
							class="rounded-2xl border border-gray-700 bg-gray-900/50 shadow-2xl shadow-red-600/10"
						>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHeading>Marka</TableHeading>
										<TableHeading>Model</TableHeading>
										<TableHeading>Rocznik</TableHeading>
										<TableHeading>Rejestracja</TableHeading>
										<TableHeading>VIN</TableHeading>
										<TableHeading>Akcje</TableHeading>
									</TableRow>
								</TableHeader>
								<TableBody>
									{#each await getUserVehicles() as vehicle}
										<TableRow>
											<TableCell>{vehicle.make}</TableCell>
											<TableCell>{vehicle.model}</TableCell>
											<TableCell>{vehicle.year}</TableCell>
											<TableCell>{vehicle.registration || '-'}</TableCell>
											<TableCell>{vehicle.vin || '-'}</TableCell>
											<TableCell>
												<div class="flex space-x-2">
													<Button variant="blue" size="tiny" onClick={() => openEditModal(vehicle)}>
														Edytuj
													</Button>
													<Button
														variant="red"
														size="tiny"
														onClick={() => openDeleteModal(vehicle)}
													>
														Usuń
													</Button>
												</div>
											</TableCell>
										</TableRow>
									{/each}
								</TableBody>
							</Table>
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

		<!-- Modal dla dodawania pojazdu -->
		{#if showAddModal}
			<Modal onClose={closeModals}>
				<div
					class="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl shadow-red-600/10"
				>
					<h2 class="mb-8 text-2xl font-bold text-white">Dodaj Nowy Pojazd</h2>

					<form {...addVehicle}>
						<div class="space-y-6">
							<div>
								<Label for="make">Marka</Label>
								<Input
									name="make"
									id="make"
									required
									placeholder="np. Toyota"
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="model">Model</Label>
								<Input
									name="model"
									id="model"
									required
									placeholder="np. Corolla"
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="year">Rocznik</Label>
								<Input
									name="year"
									id="year"
									type="number"
									required
									min="1900"
									max={new Date().getFullYear() + 1}
									placeholder={new Date().getFullYear().toString()}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="registration">Numer Rejestracyjny (opcjonalnie)</Label>
								<Input
									name="registration"
									id="registration"
									placeholder="np. KR ABC123"
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="vin">VIN (opcjonalnie)</Label>
								<Input
									name="vin"
									id="vin"
									placeholder="17-znakowy numer VIN"
									maxlength="17"
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="color">Kolor (opcjonalnie)</Label>
								<Input
									name="color"
									id="color"
									placeholder="np. Niebieski"
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="mileage">Aktualny Przebieg (opcjonalnie)</Label>
								<Input
									name="mileage"
									id="mileage"
									type="number"
									min="0"
									placeholder="np. 50000 km"
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>
						</div>

						<div class="mt-8 flex justify-end space-x-4">
							<Button
								variant="gray_outline"
								onClick={closeModals}
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
							{closeModals()}
						{:else if addVehicle.result?.error}
							<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
								<p class="text-sm text-red-300">{addVehicle.result.error}</p>
							</div>
						{/if}
					</form>
				</div>
			</Modal>
		{/if}

		<!-- Modal dla edycji pojazdu -->
		{#if showEditModal && selectedVehicle}
			<Modal onClose={closeModals}>
				<div
					class="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl shadow-red-600/10"
				>
					<h2 class="mb-8 text-2xl font-bold text-white">Edytuj Pojazd</h2>

					<form {...updateVehicle}>
						<input type="hidden" name="id" value={selectedVehicle.id} />
						<div class="space-y-6">
							<div>
								<Label for="edit-make">Marka</Label>
								<Input
									name="make"
									id="edit-make"
									required
									value={selectedVehicle.make}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="edit-model">Model</Label>
								<Input
									name="model"
									id="edit-model"
									required
									value={selectedVehicle.model}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="edit-year">Rocznik</Label>
								<Input
									name="year"
									id="edit-year"
									type="number"
									required
									min="1900"
									max={new Date().getFullYear() + 1}
									value={selectedVehicle.year}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="edit-registration">Numer Rejestracyjny (opcjonalnie)</Label>
								<Input
									name="registration"
									id="edit-registration"
									value={selectedVehicle.registration || ''}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="edit-vin">VIN (opcjonalnie)</Label>
								<Input
									name="vin"
									id="edit-vin"
									maxlength="17"
									value={selectedVehicle.vin || ''}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="edit-color">Kolor (opcjonalnie)</Label>
								<Input
									name="color"
									id="edit-color"
									value={selectedVehicle.color || ''}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>

							<div>
								<Label for="edit-mileage">Aktualny Przebieg (opcjonalnie)</Label>
								<Input
									name="mileage"
									id="edit-mileage"
									type="number"
									min="0"
									value={selectedVehicle.mileage || ''}
									class="focus:ring-opacity-20 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
								/>
							</div>
						</div>

						<div class="mt-8 flex justify-end space-x-4">
							<Button
								variant="gray_outline"
								onClick={closeModals}
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
							{closeModals()}
						{:else if updateVehicle.result?.error}
							<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
								<p class="text-sm text-red-300">{updateVehicle.result.error}</p>
							</div>
						{/if}
					</form>
				</div>
			</Modal>
		{/if}

		<!-- Modal dla usuwania pojazdu -->
		{#if showDeleteModal && selectedVehicle}
			<Modal onClose={closeModals}>
				<div
					class="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl shadow-red-600/10"
				>
					<h2 class="mb-8 text-2xl font-bold text-white">Usuń Pojazd</h2>
					<p class="mb-8 text-lg text-gray-300">
						Czy na pewno chcesz usunąć pojazd <strong class="text-white"
							>{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</strong
						>? Ta akcja jest nieodwracalna.
					</p>

					<form {...deleteVehicle}>
						<input type="hidden" name="id" value={selectedVehicle.id} />

						<div class="flex justify-end space-x-4">
							<Button
								variant="gray_outline"
								onClick={closeModals}
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
							{closeModals()}
						{:else if deleteVehicle.result?.error}
							<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
								<p class="text-sm text-red-300">{deleteVehicle.result.error}</p>
							</div>
						{/if}
					</form>
				</div>
			</Modal>
		{/if}

		{#snippet pending()}
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
				<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
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
							<Button variant="red" disabled classes="opacity-50 cursor-not-allowed"
								>Dodaj Pojazd</Button
							>
						</div>
						<div
							class="rounded-2xl border border-gray-700 bg-gray-900/50 p-12 text-center shadow-2xl shadow-red-600/10"
						>
							<div
								class="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-red-600"
							></div>
							<h3 class="mb-4 text-xl font-semibold text-white">Ładowanie pojazdów...</h3>
							<p class="text-gray-400">Proszę czekać, pobieramy informacje o Twoich pojazdach.</p>
						</div>
					</div>
				</section>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<style>
	@keyframes bounce {
		0%,
		20%,
		53%,
		80%,
		100% {
			transform: translateY(0);
		}
		40%,
		43% {
			transform: translateY(-10px);
		}
		70% {
			transform: translateY(-5px);
		}
		90% {
			transform: translateY(-2px);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	.animate-pulse {
		animation: pulse 2s infinite;
	}
</style>
