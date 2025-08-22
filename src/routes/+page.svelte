<!-- +page.svelte -->
<script>
	import { onMount } from 'svelte';

	let isVisible = false;
	let activeFeature = 0;

	onMount(() => {
		isVisible = true;

		// Auto-rotate features every 4 seconds
		const interval = setInterval(() => {
			activeFeature = (activeFeature + 1) % 4;
		}, 4000);

		return () => clearInterval(interval);
	});

	const features = [
		{
			title: 'Znajdź Mechanika',
			description: 'Odkryj zaufanych mechaników w Twojej okolicy z opiniami klientów',
			icon: '🔧'
		},
		{
			title: 'Książka Zdrowia Auta',
			description: 'Śledź historię serwisową i stan techniczny swojego pojazdu',
			icon: '📋'
		},
		{
			title: 'Zamów Części',
			description: 'Szybkie zamawianie części samochodowych bezpośrednio przez aplikację',
			icon: '⚙️'
		},
		{
			title: 'Społeczność',
			description: 'Połącz się z mechanikami i innymi właścicielami aut',
			icon: '👥'
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

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
	<!-- Navigation -->
	<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div class="flex items-center space-x-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg">
					<span class="text-xl font-bold text-white">🚗</span>
				</div>
				<span class="text-2xl font-bold text-gray-800">Pan Samochodzik</span>
			</div>

			<div class="space-x-2 flex items-center">
				<a href="#features" class="font-medium block text-gray-600 transition-colors hover:text-red-600"
					>Funkcje</a
				>
				<a href="#about" class="font-medium block text-gray-600 transition-colors hover:text-red-600"
					>O nas</a
				>
				<a href="#contact" class="font-medium p text-gray-600 transition-colors hover:text-red-600"
					>Kontakt</a
				>
				<a href="#contact" class="font-medium text-gray-600 transition-colors hover:text-red-600"
					>Zaloguj się</a
				>

				<a href="#contact" class="font-medium text-gray-600 transition-colors hover:text-red-600"
					>Zarejestruj się</a
				>
				<button
					class="transform rounded-xl bg-red-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
				>
					Dołącz teraz
				</button>
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
						<h1 class="text-4xl leading-tight font-bold text-gray-800 sm:text-5xl lg:text-6xl">
							Rewolucja w
							<span class="relative inline-block text-red-600">
								motoryzacji
								<div
									class="absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-0 transform animate-pulse bg-red-600"
								></div>
							</span>
						</h1>
						<p class="max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
							Połącz się z najlepszymi mechanikami, zarządzaj zdrowiem swojego auta i zamawiaj
							części - wszystko w jednym miejscu.
						</p>
					</div>

					<div class="flex flex-col gap-4 sm:flex-row lg:gap-6">
						<button
							class="transform rounded-2xl bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/25"
						>
							Rozpocznij podróż
						</button>
						<button
							class="rounded-2xl border-2 border-red-600 px-8 py-4 text-lg font-semibold text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
						>
							Zobacz demo
						</button>
					</div>

					<div class="flex items-center space-x-6 pt-6">
						<div class="flex -space-x-2">
							{#each Array(4) as _, i}
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-red-500 to-red-600 text-lg font-bold text-white shadow-lg"
								>
									{i + 1}
								</div>
							{/each}
						</div>
						<span class="font-medium text-gray-600">Ponad 10,000 zadowolonych użytkowników</span>
					</div>
				</div>

				<!-- Hero Image/Animation -->
				<div class="relative mt-12 lg:mt-0">
					<div
						class="relative z-10 mx-auto max-w-md rotate-2 transform bg-white p-6 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:p-8"
					>
						<div class="space-y-6">
							<div
								class="flex items-center justify-between rounded-2xl bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6"
							>
								<div class="flex items-center space-x-3 sm:space-x-4">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl text-white sm:h-14 sm:w-14 sm:text-2xl"
									>
										🔧
									</div>
									<div>
										<h3 class="text-lg font-semibold text-gray-800">Warsztat Kowalski</h3>
										<p class="text-sm text-gray-600">⭐⭐⭐⭐⭐ 4.9/5</p>
									</div>
								</div>
								<span
									class="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600"
									>Dostępny</span
								>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div
									class="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center sm:p-6"
								>
									<div class="mb-2 text-2xl sm:text-3xl">📋</div>
									<p class="text-sm font-semibold text-gray-700">Książka Zdrowia</p>
								</div>
								<div
									class="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 text-center sm:p-6"
								>
									<div class="mb-2 text-2xl sm:text-3xl">⚙️</div>
									<p class="text-sm font-semibold text-gray-700">Części Online</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Floating elements -->
					<div
						class="absolute -top-6 -right-6 h-20 w-20 animate-bounce rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-20"
					></div>
					<div
						class="absolute -bottom-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"
					></div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section
		id="features"
		class="mx-4 my-8 bg-white px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center sm:mb-16 lg:mb-20">
				<h2 class="mb-6 text-3xl font-bold text-gray-800 sm:text-4xl lg:mb-8 lg:text-5xl">
					Wszystko czego potrzebujesz
				</h2>
				<p class="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
					Pan Samochodzik to kompleksowe rozwiązanie dla każdego właściciela samochodu i mechanika
				</p>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
				{#each features as feature, i}
					<div
						class="group cursor-pointer rounded-2xl p-6 transition-all duration-500 sm:p-8 {activeFeature ===
						i
							? 'scale-105 bg-gradient-to-br from-red-50 to-red-100 shadow-xl'
							: 'bg-gray-50 hover:bg-red-50'}"
						on:mouseenter={() => (activeFeature = i)}
					>
						<div
							class="mb-4 transform text-4xl transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:text-5xl"
						>
							{feature.icon}
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-800 sm:mb-4 sm:text-2xl">
							{feature.title}
						</h3>
						<p class="mb-6 text-base leading-relaxed text-gray-600 sm:text-lg">
							{feature.description}
						</p>

						<div
							class="flex items-center text-red-600 transition-transform duration-300 group-hover:translate-x-2"
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

	<!-- Stats Section -->
	<section
		class="mx-4 my-8 bg-gradient-to-r from-red-600 to-red-700 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
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
		class="mx-4 my-8 bg-gray-50 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="mb-6 text-3xl font-bold text-gray-800 sm:text-4xl">Jak to działa?</h2>
				<p class="text-lg text-gray-600 sm:text-xl">Prosty proces w trzech krokach</p>
			</div>

			<div class="grid gap-12 md:grid-cols-3">
				<div class="space-y-6 text-center">
					<div
						class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg"
					>
						1
					</div>
					<h3 class="text-xl font-semibold text-gray-800">Znajdź mechanika</h3>
					<p class="leading-relaxed text-gray-600">
						Wyszukaj najlepszych mechaników w swojej okolicy i sprawdź ich opinie
					</p>
				</div>

				<div class="space-y-6 text-center">
					<div
						class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg"
					>
						2
					</div>
					<h3 class="text-xl font-semibold text-gray-800">Umów wizytę</h3>
					<p class="leading-relaxed text-gray-600">
						Zarezerwuj termin online i zarządzaj książką zdrowia swojego auta
					</p>
				</div>

				<div class="space-y-6 text-center">
					<div
						class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg"
					>
						3
					</div>
					<h3 class="text-xl font-semibold text-gray-800">Zamów części</h3>
					<p class="leading-relaxed text-gray-600">
						Kup potrzebne części bezpośrednio przez aplikację z szybką dostawą
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section
		class="mx-4 my-8 bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">
				Gotowy na rewolucję w motoryzacji?
			</h2>
			<p class="mb-10 text-lg text-gray-300 sm:text-xl">
				Dołącz do tysięcy zadowolonych użytkowników już dziś
			</p>

			<div class="flex flex-col justify-center gap-6 sm:flex-row">
				<button
					class="transform rounded-2xl bg-red-600 px-10 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-red-500/25"
				>
					Dołącz jako użytkownik
				</button>
				<button
					class="rounded-2xl border-2 border-white px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
				>
					Dołącz jako mechanik
				</button>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer
		class="mx-4 mt-8 mb-8 bg-gray-900 px-4 py-12 sm:mx-6 sm:mt-12 sm:mb-12 sm:px-6 lg:mx-8 lg:mt-16 lg:mb-16 lg:px-8"
	>
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 flex items-center space-x-3 md:mb-0">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
						<span class="text-xl font-bold text-white">🚗</span>
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

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	.animate-pulse {
		animation: pulse 2s infinite;
	}
</style>
