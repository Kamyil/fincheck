<script lang="ts">
	import { enhance } from '$app/forms';
	import Car from 'lucide-svelte/icons/car';
	import Wrench from 'lucide-svelte/icons/wrench';
	import Calendar from 'lucide-svelte/icons/calendar';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Button from '$lib/components/common/Button.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Panel Klienta - Pan Samochodzik</title>
	<meta
		name="description"
		content="Panel klienta - znajdź najlepszych mechaników w swojej okolicy"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
	<!-- Navigation -->
	<nav class="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
						<Car class="h-5 w-5 text-white" />
					</div>
					<span class="ml-3 text-xl font-bold text-white">Pan Samochodzik</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="text-gray-300">Witaj, {data.user.username}</span>
					<form method="post" action="/logout" use:enhance>
						<Button type="submit" variant="gray_outline" size="small">Wyloguj</Button>
					</form>
				</div>
			</div>
		</div>
	</nav>

	<!-- Dashboard Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Welcome Section -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-white">Panel Klienta</h1>
			<p class="mt-2 text-gray-400">Znajdź najlepszych mechaników w swojej okolicy</p>
		</div>

		<!-- Quick Actions -->
		<div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-lg border border-gray-700 bg-gray-900 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
						<Wrench class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-medium text-white">Znajdź Mechanika</h3>
						<p class="text-gray-400">Wyszukaj mechaników w okolicy</p>
					</div>
				</div>
				<Button variant="blue" size="full_width" classes="mt-4">Wyszukaj</Button>
			</div>

			<div class="rounded-lg border border-gray-700 bg-gray-900 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
						<Calendar class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-medium text-white">Umów Wizytę</h3>
						<p class="text-gray-400">Zarezerwuj termin serwisu</p>
					</div>
				</div>
				<Button variant="green" size="full_width" classes="mt-4">Umów</Button>
			</div>

			<div class="rounded-lg border border-gray-700 bg-gray-900 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600">
						<Car class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-medium text-white">Moje Pojazdy</h3>
						<p class="text-gray-400">Zarządzaj swoimi samochodami</p>
					</div>
				</div>
				<Button
					variant="orange"
					size="full_width"
					classes="mt-4"
					onClick={() => (window.location.href = '/vehicles')}>Zobacz</Button
				>
			</div>

			<div class="rounded-lg border border-gray-700 bg-gray-900 p-6">
				<div class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
						<MapPin class="h-6 w-6 text-white" />
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-medium text-white">Moja Lokalizacja</h3>
						<p class="text-gray-400">Zaktualizuj lokalizację</p>
					</div>
				</div>
				<Button variant="purple" size="full_width" classes="mt-4">Aktualizuj</Button>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="rounded-lg border border-gray-700 bg-gray-900">
			<div class="border-b border-gray-700 px-6 py-4">
				<h2 class="text-xl font-semibold text-white">Ostatnia Aktywność</h2>
			</div>
			<div class="p-6">
				<div class="text-center text-gray-400">
					<p>Brak aktywności do wyświetlenia</p>
					<p class="mt-2 text-sm">Zacznij od znalezienia mechanika w swojej okolicy</p>
				</div>
			</div>
		</div>
	</main>
</div>
