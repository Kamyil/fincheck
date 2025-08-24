<!-- +page.svelte -->
<script>
	import { onMount } from 'svelte';
	import BookOpenIcon from 'lucide-svelte/icons/book-open';
	import MessageCircleIcon from 'lucide-svelte/icons/message-circle';
	import TagIcon from 'lucide-svelte/icons/tag';
	import UsersIcon from 'lucide-svelte/icons/users';
	import SettingsIcon from 'lucide-svelte/icons/settings';
	import CarIcon from 'lucide-svelte/icons/car';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import DollarSignIcon from 'lucide-svelte/icons/dollar-sign';
	import SearchIcon from 'lucide-svelte/icons/search';
	import BarChart3Icon from 'lucide-svelte/icons/bar-chart-3';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';
	import SendIcon from 'lucide-svelte/icons/send';
	import TruckIcon from 'lucide-svelte/icons/truck';
	import GemIcon from 'lucide-svelte/icons/gem';
	import ShieldIcon from 'lucide-svelte/icons/shield';
	import WrenchIcon from 'lucide-svelte/icons/wrench';
	import SmartphoneIcon from 'lucide-svelte/icons/smartphone';
	import PartyPopperIcon from 'lucide-svelte/icons/party-popper';
	import Button from '$lib/components/common/Button.svelte';

	let isVisible = false;
	let activeFeature = 0;

	onMount(() => {
		isVisible = true;

		// Auto-rotate features every 4 seconds
		const interval = setInterval(() => {
			activeFeature = (activeFeature + 1) % 5;
		}, 4000);

		return () => clearInterval(interval);
	});

	const features = [
		{
			title: 'Książka Zdrowia Auta',
			description:
				'Kompletna historia serwisowa, przeglądy techniczne, przypomnienia o serwisach i monitoring stanu technicznego w jednym miejscu',
			icon: BookOpenIcon,
			details: [
				'Historia napraw i serwisów',
				'Przypomnienia o przeglądach',
				'Stan techniczny pojazdu',
				'Koszty utrzymania'
			]
		},
		{
			title: 'Bezpośrednia Komunikacja',
			description:
				'Czat w czasie rzeczywistym z mechanikami - zadawaj pytania, otrzymuj porady i śledź postęp napraw',
			icon: MessageCircleIcon,
			details: ['Chat z mechanikami', 'Porady ekspertów', 'Zdjęcia problemów', 'Status napraw']
		},
		{
			title: 'System Ofert',
			description:
				'Opisz problem swojego auta i otrzymaj konkurencyjne oferty od mechaników w Twojej okolicy',
			icon: TagIcon,
			details: ['Opisy problemów', 'Konkurencyjne ceny', 'Porównanie ofert', 'Oceny mechaników']
		},
		{
			title: 'Forum Motoryzacyjne',
			description:
				'Dołącz do społeczności motoryzacyjnej - dziel się doświadczeniami i szukaj rozwiązań',
			icon: UsersIcon,
			details: [
				'Społeczność ekspertów',
				'Wymiana doświadczeń',
				'Porady techniczne',
				'Recenzje części'
			]
		},
		{
			title: 'Zamawianie Części',
			description:
				'Łatwe zamawianie oryginalnych i zamiennych części samochodowych z szybką dostawą',
			icon: SettingsIcon,
			details: ['Katalog części', 'Szybka dostawa', 'Konkurencyjne ceny', 'Gwarancja jakości']
		}
	];
</script>

<svelte:head>
	<title>Pan Samochodzik - Twój Cyfrowy Asystent Motoryzacyjny</title>
	<meta
		name="description"
		content="Znajdź mechanika, zarządzaj książką zdrowia auta i zamawiaj części - wszystko w jednej aplikacji"
	/>
</svelte:head>

<div class="relative min-h-screen overflow-hidden">
	<!-- Navigation -->
	<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div class="flex items-center space-x-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/25"
				>
					<CarIcon class="h-6 w-6 text-white" />
				</div>
				<span class="text-2xl font-bold text-white">Pan Samochodzik</span>
			</div>

			<div class="flex items-center space-x-4">
				<a
					href="#features"
					class="hidden font-medium text-gray-300 transition-colors hover:text-red-400 sm:block"
					>Funkcje</a
				>
				<a
					href="/forum"
					class="hidden font-medium text-gray-300 transition-colors hover:text-red-400 sm:block"
					>Forum</a
				>
				<a
					href="/parts"
					class="hidden font-medium text-gray-300 transition-colors hover:text-red-400 sm:block"
					>Części</a
				>
				<a href="/login" class="font-medium text-gray-300 transition-colors hover:text-red-400"
					>Zaloguj się</a
				>
				<Button
					variant="red"
					classes="transform shadow-lg shadow-red-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-700/25"
				>
					Dołącz teraz
				</Button>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section
		class="relative mx-4 overflow-hidden px-4 py-16 sm:mx-6 sm:px-6 sm:py-20 lg:mx-8 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<div class="space-y-8 lg:space-y-10">
					<div class="space-y-6 lg:space-y-8">
						<h1 class="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
							Rewolucja w
							<span class="relative inline-block text-red-500">
								motoryzacji
								<div
									class="animate-expand absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-100 transform bg-red-500"
								></div>
							</span>
						</h1>
						<p class="max-w-xl text-lg leading-relaxed text-gray-300 sm:text-xl">
							Połącz się z najlepszymi mechanikami, zarządzaj zdrowiem swojego auta i zamawiaj
							części - wszystko w jednym miejscu.
						</p>
					</div>

					<div class="flex flex-col gap-4 sm:flex-row lg:gap-6">
						<a
							href="/register"
							class="transform rounded-2xl bg-red-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/25"
						>
							Rozpocznij podróż
						</a>
						<a
							href="#features"
							class="rounded-2xl border-2 border-red-600 px-8 py-4 text-center text-lg font-semibold text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
						>
							Zobacz funkcje
						</a>
					</div>

					<div class="flex items-center space-x-6 pt-6">
						<div class="flex -space-x-2">
							{#each Array(4) as _, i}
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-800 bg-gradient-to-r from-red-500 to-red-600 text-lg font-bold text-white shadow-lg"
								>
									{i + 1}
								</div>
							{/each}
						</div>
						<span class="font-medium text-gray-300">Ponad 10,000 zadowolonych użytkowników</span>
					</div>
				</div>

				<!-- Hero Image/Animation -->
				<div class="relative mt-12 lg:mt-0">
					<div
						class="relative z-10 mx-auto max-w-md rotate-2 transform border border-gray-700 bg-gray-900 p-6 shadow-2xl shadow-red-600/10 transition-transform duration-500 hover:rotate-0 sm:p-8"
					>
						<div class="space-y-6">
							<div
								class="flex items-center justify-between rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 p-4 sm:p-6"
							>
								<div class="flex items-center space-x-3 sm:space-x-4">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl text-white sm:h-14 sm:w-14 sm:text-2xl"
									>
										🔧
									</div>
									<div>
										<h3 class="text-lg font-semibold text-white">Warsztat Kowalski</h3>
										<p class="text-sm text-gray-300">⭐⭐⭐⭐⭐ 4.9/5</p>
									</div>
								</div>
								<span class="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white"
									>Dostępny</span
								>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div
									class="rounded-xl border border-gray-600 bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-center sm:p-6"
								>
									<div class="mb-2 text-2xl sm:text-3xl">📋</div>
									<p class="text-sm font-semibold text-white">Książka Zdrowia</p>
								</div>
								<div
									class="rounded-xl border border-gray-600 bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-center sm:p-6"
								>
									<div class="mb-2 text-2xl sm:text-3xl">⚙️</div>
									<p class="text-sm font-semibold text-white">Części Online</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Floating elements -->
					<div
						class="absolute -right-6 -top-6 h-20 w-20 animate-bounce rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-30"
					></div>
					<div
						class="absolute -bottom-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-20"
					></div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section
		id="features"
		class="mx-4 my-8 border border-gray-800 bg-gray-900 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center sm:mb-16 lg:mb-20">
				<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl lg:mb-8 lg:text-5xl">
					Wszystko czego potrzebujesz
				</h2>
				<p class="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
					Pan Samochodzik to kompleksowe rozwiązanie dla każdego właściciela samochodu i mechanika
				</p>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-5">
				{#each features as feature, i}
					<div
						class="group cursor-pointer rounded-2xl border p-6 transition-all duration-500 sm:p-8 {activeFeature ===
						i
							? 'scale-105 border-red-600 bg-gradient-to-br from-red-900/50 to-red-800/50 shadow-xl shadow-red-600/20'
							: 'border-gray-700 bg-gray-800/50 hover:bg-red-900/30'}"
						on:mouseenter={() => (activeFeature = i)}
					>
						<div
							class="mb-4 transform transition-transform duration-300 group-hover:scale-110 sm:mb-6"
						>
							<svelte:component
								this={feature.icon}
								class="h-12 w-12 text-red-500 sm:h-14 sm:w-14"
							/>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
							{feature.title}
						</h3>
						<p class="mb-6 text-base leading-relaxed text-gray-300 sm:text-lg">
							{feature.description}
						</p>

						{#if feature.details}
							<ul class="mb-6 space-y-2">
								{#each feature.details as detail}
									<li class="flex items-center text-sm text-gray-400">
										<svg
											class="mr-2 h-4 w-4 text-green-400"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											></path>
										</svg>
										{detail}
									</li>
								{/each}
							</ul>
						{/if}

						<div
							class="flex items-center text-red-400 transition-transform duration-300 group-hover:translate-x-2"
						>
							<span class="text-sm font-semibold">Dowiedz się więcej</span>
							<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								></path>
							</svg>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Detailed Features Showcase -->
	<section
		class="mx-4 my-8 border border-gray-800 bg-gray-900 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<!-- Car Health Book Feature -->
			<div class="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<div class="space-y-6">
					<div class="flex items-center space-x-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full border border-red-600 bg-red-600/20"
						>
							<BookOpenIcon class="h-6 w-6 text-red-400" />
						</div>
						<h3 class="text-3xl font-bold text-white">Książka Zdrowia Auta</h3>
					</div>
					<p class="text-lg leading-relaxed text-gray-300">
						Kompleksowe zarządzanie historią serwisową Twojego pojazdu. Śledzenie wszystkich napraw,
						przeglądów i kosztów w jednym miejscu.
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-white">
								<CalendarIcon class="h-4 w-4 text-red-400" />
								Przypomnienia
							</div>
							<p class="text-sm text-gray-400">Automatyczne powiadomienia o terminach przeglądów</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-white">
								<DollarSignIcon class="h-4 w-4 text-red-400" />
								Koszty
							</div>
							<p class="text-sm text-gray-400">Analiza wydatków na utrzymanie auta</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-white">
								<SearchIcon class="h-4 w-4 text-red-400" />
								Historia
							</div>
							<p class="text-sm text-gray-400">Pełna dokumentacja wszystkich serwisów</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-white">
								<BarChart3Icon class="h-4 w-4 text-red-400" />
								Raporty
							</div>
							<p class="text-sm text-gray-400">Szczegółowe raporty o stanie pojazdu</p>
						</div>
					</div>
				</div>
				<div
					class="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8"
				>
					<div class="space-y-4 rounded-xl border border-gray-700 bg-black/50 p-6 shadow-lg">
						<div class="flex items-center justify-between">
							<span class="font-semibold text-white">Toyota Corolla 2020</span>
							<span class="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white"
								>Sprawny</span
							>
						</div>
						<div class="space-y-3">
							<div class="flex justify-between text-sm">
								<span class="text-gray-400">Ostatni przegląd:</span>
								<span class="font-medium text-white">15.01.2025</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-400">Następny serwis:</span>
								<span class="font-medium text-red-400">Za 2 tygodnie</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-400">Przebieg:</span>
								<span class="font-medium text-white">95,420 km</span>
							</div>
						</div>
						<div class="mt-4 h-2 w-full rounded-full bg-gray-700">
							<div class="h-2 w-3/4 rounded-full bg-green-500"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- Direct Communication Feature -->
			<div class="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<div
					class="order-2 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 lg:order-1"
				>
					<div class="space-y-4 rounded-xl bg-white p-6 shadow-lg">
						<div class="flex items-center space-x-3">
							<div class="h-10 w-10 rounded-full bg-red-600"></div>
							<div>
								<div class="font-semibold text-gray-800">Mechanik Kowalski</div>
								<div class="text-sm text-green-600">● Online</div>
							</div>
						</div>
						<div class="space-y-3">
							<div class="rounded-lg bg-gray-100 p-3 text-sm">
								Sprawdziłem Twoje zdjęcia. To problem z klockami hamulcowymi.
							</div>
							<div class="rounded-lg bg-red-50 p-3 text-right text-sm">
								Ile będzie kosztować naprawa?
							</div>
							<div class="rounded-lg bg-gray-100 p-3 text-sm">
								Około 300-400 zł z robocizną. Mogę zacząć jutro rano.
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<input
								class="flex-1 rounded-full border px-4 py-2 text-sm"
								placeholder="Napisz wiadomość..."
							/>
							<Button variant="red" size="icon_small" icon={SendIcon} />
						</div>
					</div>
				</div>
				<div class="order-1 space-y-6 lg:order-2">
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<MessageCircleIcon class="h-6 w-6 text-green-600" />
						</div>
						<h3 class="text-3xl font-bold text-gray-800">Bezpośrednia Komunikacja</h3>
					</div>
					<p class="text-lg leading-relaxed text-gray-600">
						Czat w czasie rzeczywistym z mechanikami. Wysyłaj zdjęcia problemów, otrzymuj porady i
						śledź postęp napraw bez wychodzenia z domu.
					</p>
					<div class="space-y-4">
						<div class="flex items-center space-x-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
								<CheckCircleIcon class="h-5 w-5 text-white" />
							</div>
							<span class="text-gray-700">Instant messaging z mechanikami</span>
						</div>
						<div class="flex items-center space-x-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
								<CheckCircleIcon class="h-5 w-5 text-white" />
							</div>
							<span class="text-gray-700">Wysyłanie zdjęć problemów</span>
						</div>
						<div class="flex items-center space-x-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
								<CheckCircleIcon class="h-5 w-5 text-white" />
							</div>
							<span class="text-gray-700">Śledzenie statusu napraw</span>
						</div>
						<div class="flex items-center space-x-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
								<CheckCircleIcon class="h-5 w-5 text-white" />
							</div>
							<span class="text-gray-700">Historie wszystkich rozmów</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Tenders/Bidding System Feature -->
			<div class="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<div class="space-y-6">
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
							<TagIcon class="h-6 w-6 text-purple-600" />
						</div>
						<h3 class="text-3xl font-bold text-gray-800">System Ofert</h3>
					</div>
					<p class="text-lg leading-relaxed text-gray-600">
						Opisz problem swojego auta i otrzymaj konkurencyjne oferty od sprawdzonych mechaników w
						Twojej okolicy. Porównuj ceny i wybieraj najlepszą opcję.
					</p>
					<div class="space-y-4">
						<div class="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
							<div class="font-semibold text-purple-800">1. Opisz problem</div>
							<p class="text-sm text-purple-700">Dodaj opis, zdjęcia i lokalizację</p>
						</div>
						<div class="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
							<div class="font-semibold text-purple-800">2. Otrzymaj oferty</div>
							<p class="text-sm text-purple-700">Mechanicy składają konkurencyjne propozycje</p>
						</div>
						<div class="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
							<div class="font-semibold text-purple-800">3. Wybierz najlepszą</div>
							<p class="text-sm text-purple-700">Porównaj ceny, opinie i lokalizacje</p>
						</div>
					</div>
				</div>
				<div class="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-8">
					<div class="space-y-4 rounded-xl bg-white p-6 shadow-lg">
						<div class="border-b pb-3">
							<div class="font-semibold text-gray-800">Problem z silnikiem - BMW 320i</div>
							<div class="text-sm text-gray-600">3 oferty otrzymane</div>
						</div>
						<div class="space-y-3">
							<div class="rounded-lg border p-3">
								<div class="flex items-center justify-between">
									<div>
										<div class="font-medium text-gray-800">AutoSerwis Nowak</div>
										<div class="text-sm text-gray-600">⭐ 4.8 • 2.5 km</div>
									</div>
									<div class="text-right">
										<div class="font-bold text-green-600">450 zł</div>
										<div class="text-xs text-gray-500">+ części</div>
									</div>
								</div>
							</div>
							<div class="rounded-lg border p-3">
								<div class="flex items-center justify-between">
									<div>
										<div class="font-medium text-gray-800">Mechanik Kowalski</div>
										<div class="text-sm text-gray-600">⭐ 4.9 • 1.8 km</div>
									</div>
									<div class="text-right">
										<div class="font-bold text-green-600">380 zł</div>
										<div class="text-xs text-gray-500">+ części</div>
									</div>
								</div>
							</div>
							<div class="rounded-lg border p-3">
								<div class="flex items-center justify-between">
									<div>
										<div class="font-medium text-gray-800">BMW Serwis Pro</div>
										<div class="text-sm text-gray-600">⭐ 4.7 • 3.2 km</div>
									</div>
									<div class="text-right">
										<div class="font-bold text-green-600">520 zł</div>
										<div class="text-xs text-gray-500">z częściami</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Forum Feature -->
			<div class="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<div
					class="order-2 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-8 lg:order-1"
				>
					<div class="space-y-4 rounded-xl bg-white p-6 shadow-lg">
						<div class="border-b pb-3">
							<div class="font-semibold text-gray-800">Najnowsze posty na forum</div>
						</div>
						<div class="space-y-4">
							<div class="border-l-4 border-orange-500 pl-4">
								<div class="font-medium text-gray-800">Jak wymienić olej w Golf VII?</div>
								<div class="text-sm text-gray-600">15 odpowiedzi • Dodano 2h temu</div>
							</div>
							<div class="border-l-4 border-orange-500 pl-4">
								<div class="font-medium text-gray-800">Problem z klimatyzacją Audi A4</div>
								<div class="text-sm text-gray-600">8 odpowiedzi • Dodano 5h temu</div>
							</div>
							<div class="border-l-4 border-orange-500 pl-4">
								<div class="font-medium text-gray-800">Polecane opony zimowe 2025</div>
								<div class="text-sm text-gray-600">23 odpowiedzi • Dodano wczoraj</div>
							</div>
						</div>
						<Button variant="orange" size="full_width">Zadaj pytanie</Button>
					</div>
				</div>
				<div class="order-1 space-y-6 lg:order-2">
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
							<UsersIcon class="h-6 w-6 text-orange-600" />
						</div>
						<h3 class="text-3xl font-bold text-gray-800">Forum Motoryzacyjne</h3>
					</div>
					<p class="text-lg leading-relaxed text-gray-600">
						Dołącz do największej społeczności motoryzacyjnej w Polsce. Zadawaj pytania, dziel się
						doświadczeniem i pomagaj innym kierowcom.
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div class="rounded-lg bg-orange-50 p-4 text-center">
							<div class="text-2xl font-bold text-orange-600">50k+</div>
							<div class="text-sm text-gray-600">Aktywnych użytkowników</div>
						</div>
						<div class="rounded-lg bg-orange-50 p-4 text-center">
							<div class="text-2xl font-bold text-orange-600">15k+</div>
							<div class="text-sm text-gray-600">Rozwiązanych problemów</div>
						</div>
					</div>
					<div class="space-y-3">
						<div class="flex items-center space-x-3">
							<WrenchIcon class="h-6 w-6 text-orange-600" />
							<span class="text-gray-700">Porady od ekspertów</span>
						</div>
						<div class="flex items-center space-x-3">
							<CarIcon class="h-6 w-6 text-orange-600" />
							<span class="text-gray-700">Wszystkie marki aut</span>
						</div>
						<div class="flex items-center space-x-3">
							<SmartphoneIcon class="h-6 w-6 text-orange-600" />
							<span class="text-gray-700">Mobilna aplikacja</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Parts Ordering Feature -->
			<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<div class="space-y-6">
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<SettingsIcon class="h-6 w-6 text-red-600" />
						</div>
						<h3 class="text-3xl font-bold text-gray-800">Zamawianie Części</h3>
					</div>
					<p class="text-lg leading-relaxed text-gray-600">
						Największy katalog części samochodowych online. Oryginalne i zamienniki w najlepszych
						cenach z szybką dostawą nawet w 24h.
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-gray-800">
								<TruckIcon class="h-4 w-4 text-red-600" />
								Szybka dostawa
							</div>
							<p class="text-sm text-gray-600">24-48h w całej Polsce</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-gray-800">
								<GemIcon class="h-4 w-4 text-red-600" />
								Oryginały
							</div>
							<p class="text-sm text-gray-600">Części OEM i zamienniki</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-gray-800">
								<SearchIcon class="h-4 w-4 text-red-600" />
								Wyszukiwarka
							</div>
							<p class="text-sm text-gray-600">Znajdź po VIN lub modelu</p>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 font-semibold text-gray-800">
								<ShieldIcon class="h-4 w-4 text-red-600" />
								Gwarancja
							</div>
							<p class="text-sm text-gray-600">Pełna gwarancja na części</p>
						</div>
					</div>
					<div class="rounded-lg bg-red-50 p-4">
						<div class="flex items-center gap-2 font-semibold text-red-800">
							<PartyPopperIcon class="h-4 w-4 text-red-600" />
							Promocja dla nowych użytkowników
						</div>
						<p class="text-sm text-red-700">-15% na pierwsze zamówienie powyżej 200 zł</p>
					</div>
				</div>
				<div class="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-8">
					<div class="space-y-4 rounded-xl bg-white p-6 shadow-lg">
						<div class="flex items-center justify-between border-b pb-3">
							<div class="font-semibold text-gray-800">Koszyk</div>
							<div class="text-sm text-gray-600">3 pozycje</div>
						</div>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="h-12 w-12 rounded bg-gray-100"></div>
									<div>
										<div class="font-medium text-gray-800">Klocki hamulcowe</div>
										<div class="text-sm text-gray-600">BMW 320i E90</div>
									</div>
								</div>
								<div class="text-right">
									<div class="font-bold text-gray-800">149 zł</div>
									<div class="text-xs text-green-600">✓ Dostępny</div>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="h-12 w-12 rounded bg-gray-100"></div>
									<div>
										<div class="font-medium text-gray-800">Filtr oleju</div>
										<div class="text-sm text-gray-600">BMW 320i E90</div>
									</div>
								</div>
								<div class="text-right">
									<div class="font-bold text-gray-800">35 zł</div>
									<div class="text-xs text-green-600">✓ Dostępny</div>
								</div>
							</div>
						</div>
						<div class="border-t pt-3">
							<div class="flex items-center justify-between text-lg font-bold">
								<span>Razem:</span>
								<span class="text-red-600">184 zł</span>
							</div>
							<Button variant="red" size="full_width" classes="mt-3">Zamów teraz</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section
		class="mx-4 my-8 bg-gradient-to-r from-red-600 to-red-800 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="grid gap-8 text-center sm:grid-cols-2 md:grid-cols-4">
				<div class="space-y-2">
					<div class="text-4xl font-bold text-white">10K+</div>
					<div class="text-red-100">Zadowolonych użytkowników</div>
				</div>
				<div class="space-y-2">
					<div class="text-4xl font-bold text-white">500+</div>
					<div class="text-red-100">Partnerskich warsztatów</div>
				</div>
				<div class="space-y-2">
					<div class="text-4xl font-bold text-white">50K+</div>
					<div class="text-red-100">Zrealizowanych serwisów</div>
				</div>
				<div class="space-y-2">
					<div class="text-4xl font-bold text-white">4.9</div>
					<div class="text-red-100">Średnia ocena aplikacji</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section
		class="mx-4 my-8 border border-gray-700 bg-gray-800 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">Jak to działa?</h2>
				<p class="text-lg text-gray-300 sm:text-xl">Prosty proces w trzech krokach</p>
			</div>

			<div class="grid gap-12 md:grid-cols-3">
				<div class="space-y-6 text-center">
					<div
						class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg shadow-red-600/25"
					>
						1
					</div>
					<h3 class="text-xl font-semibold text-white">Znajdź mechanika</h3>
					<p class="leading-relaxed text-gray-300">
						Wyszukaj najlepszych mechaników w swojej okolicy i sprawdź ich opinie
					</p>
				</div>

				<div class="space-y-6 text-center">
					<div
						class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg shadow-red-600/25"
					>
						2
					</div>
					<h3 class="text-xl font-semibold text-white">Umów wizytę</h3>
					<p class="leading-relaxed text-gray-300">
						Zarezerwuj termin online i zarządzaj książką zdrowia swojego auta
					</p>
				</div>

				<div class="space-y-6 text-center">
					<div
						class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg shadow-red-600/25"
					>
						3
					</div>
					<h3 class="text-xl font-semibold text-white">Zamów części</h3>
					<p class="leading-relaxed text-gray-300">
						Kup potrzebne części bezpośrednio przez aplikację z szybką dostawą
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section
		class="mx-4 my-8 bg-gradient-to-br from-gray-900 to-black px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">
				Gotowy na rewolucję w motoryzacji?
			</h2>
			<p class="mb-10 text-lg text-gray-300 sm:text-xl">
				Dołącz do tysięcy zadowolonych użytkowników już dziś
			</p>

			<div class="flex flex-col justify-center gap-6 sm:flex-row">
				<a
					href="/register?type=customer"
					class="transform rounded-2xl bg-red-600 px-10 py-4 text-center text-lg font-semibold text-white shadow-2xl shadow-red-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-red-700/25"
				>
					Dołącz jako użytkownik
				</a>
				<a
					href="/register?type=mechanic"
					class="rounded-2xl border-2 border-white px-10 py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
				>
					Dołącz jako mechanik
				</a>
			</div>
		</div>
	</section>

	<section></section>

	<!-- Footer -->
	<footer
		class="mx-4 mb-8 mt-8 bg-black px-4 py-12 sm:mx-6 sm:mb-12 sm:mt-12 sm:px-6 lg:mx-8 lg:mb-16 lg:mt-16 lg:px-8"
	>
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 flex items-center space-x-3 md:mb-0">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
						<CarIcon class="h-5 w-5 text-white" />
					</div>
					<span class="text-2xl font-bold text-white">Pan Samochodzik</span>
				</div>

				<div class="text-center text-gray-400 md:text-right">
					<p>&copy; 2025 Pan Samochodzik. Wszystkie prawa zastrzeżone.</p>
					<p class="mt-1 text-sm">Twój cyfrowy asystent motoryzacyjny</p>
				</div>
			</div>
		</div>
	</footer>
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

	@keyframes expand {
		0% {
			transform: scaleX(0);
		}
		100% {
			transform: scaleX(1);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	.animate-pulse {
		animation: pulse 2s infinite;
	}

	.animate-expand {
		animation: expand 2s ease-out forwards;
	}
</style>
