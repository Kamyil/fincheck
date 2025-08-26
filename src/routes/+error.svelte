<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import CarIcon from 'lucide-svelte/icons/car';
	import WrenchIcon from 'lucide-svelte/icons/wrench';
	import SettingsIcon from 'lucide-svelte/icons/settings';
	import HomeIcon from 'lucide-svelte/icons/home';
	import RefreshCwIcon from 'lucide-svelte/icons/refresh-cw';
	import AlertTriangleIcon from 'lucide-svelte/icons/alert-triangle';
	import Button from '$lib/components/common/Button.svelte';
	import { HTTP_STATUS_CODE } from '$lib/httpStatusCodes';

	let isVisible = $state(false);
	let animationDelay = 0;

	onMount(() => {
		isVisible = true;
		// Stagger animation delays for floating elements
		setTimeout(() => (animationDelay = 1), 100);
	});

	// Get error details
	let status = $derived($page.status);
	let error = $derived($page.error);

	// Error messages based on status code
	const errorMessages: Record<number, { title: string; description: string; action: string }> = {
		[HTTP_STATUS_CODE.BAD_REQUEST]: {
			title: 'Błędne Żądanie',
			description:
				'Sprawdź formularz i spróbuj ponownie. Możliwe, że niektóre pola zostały wypełnione nieprawidłowo.',
			action: 'Popraw dane i spróbuj ponownie'
		},
		[HTTP_STATUS_CODE.UNAUTHORIZED]: {
			title: 'Brak Autoryzacji',
			description:
				'Musisz być zalogowany aby uzyskać dostęp do tej strony. Zaloguj się lub utwórz nowe konto.',
			action: 'Przejdź do logowania'
		},
		[HTTP_STATUS_CODE.FORBIDDEN]: {
			title: 'Dostęp Zabroniony',
			description:
				'Nie masz uprawnień do wyświetlenia tej strony. Skontaktuj się z administratorem jeśli uważasz, że to błąd.',
			action: 'Sprawdź swoje uprawnienia'
		},
		[HTTP_STATUS_CODE.NOT_FOUND]: {
			title: 'Strona Nie Znaleziona',
			description:
				'Strona której szukasz nie istnieje lub została przeniesiona. Sprawdź adres URL lub użyj nawigacji.',
			action: 'Wróć na stronę główną'
		},
		[HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR]: {
			title: 'Błąd Serwera',
			description:
				'Wystąpił nieoczekiwany problem po stronie serwera. Nasz zespół został powiadomiony i pracuje nad rozwiązaniem.',
			action: 'Spróbuj za chwilę'
		},
		[HTTP_STATUS_CODE.SERVICE_UNAVAILABLE]: {
			title: 'Serwis Niedostępny',
			description:
				'Serwis jest czasowo niedostępny z powodu konserwacji lub przeciążenia. Spróbuj ponownie za kilka minut.',
			action: 'Odśwież stronę'
		}
	};

	let errorInfo = $derived(
		errorMessages[status] || {
			title: 'Wystąpił Błąd',
			description: 'Coś poszło nie tak. Spróbuj odświeżyć stronę lub wróć na stronę główną.',
			action: 'Spróbuj ponownie'
		}
	);

	function handleRefresh() {
		window.location.reload();
	}

	function handleGoHome() {
		window.location.href = '/';
	}

	function handleGoBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			handleGoHome();
		}
	}
</script>

<svelte:head>
	<title>Błąd {status} - Pan Samochodzik</title>
</svelte:head>

<div class="relative min-h-screen overflow-hidden">
	<!-- Background with asphalt texture matching the main layout -->
	<div
		class="absolute inset-0 opacity-10"
		style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0); background-size: 20px 20px;"
	></div>

	<!-- Main Error Content -->
	<div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Animated Error Code Display -->
			<div class="mb-8 {isVisible ? 'animate-float-in' : 'translate-y-8 opacity-0'}">
				<div class="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
					<!-- Rotating background circle -->
					<div
						class="animate-spin-slow absolute inset-0 rounded-full border-4 border-red-600/20"
					></div>
					<div
						class="animate-spin-reverse-slow absolute inset-2 rounded-full border-2 border-red-400/30"
					></div>

					<!-- Error icon in the center -->
					<div
						class="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/25"
					>
						<AlertTriangleIcon class="h-8 w-8 animate-pulse text-white" />
					</div>

					<!-- Status code overlay -->
					<div
						class="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-600 bg-gray-800 shadow-lg"
					>
						<span class="text-sm font-bold text-red-400">{status}</span>
					</div>
				</div>
			</div>

			<!-- Error Title and Description -->
			<div
				class="mb-12 space-y-6 {isVisible ? 'animate-float-in-delayed' : 'translate-y-8 opacity-0'}"
			>
				<h1 class="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
					{errorInfo.title}
				</h1>

				<div class="mx-auto max-w-2xl">
					<p class="text-lg leading-relaxed text-gray-300 sm:text-xl">
						{errorInfo.description}
					</p>

					{#if error?.message && error.message !== errorInfo.description}
						<div class="mt-4 rounded-lg border border-red-600/30 bg-red-900/20 p-4">
							<p class="text-sm text-red-300">
								<strong>Szczegóły:</strong>
								{error.message}
							</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Action Buttons -->
			<div
				class="flex flex-col gap-4 sm:flex-row sm:justify-center lg:gap-6 {isVisible
					? 'animate-float-in-delayed-2'
					: 'translate-y-8 opacity-0'}"
			>
				{#if status === HTTP_STATUS_CODE.NOT_FOUND}
					<Button
						variant="red"
						size="error_button"
						classes="transform font-semibold shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-red-500/25 rounded-2xl"
						onclick={handleGoHome}
						icon={HomeIcon}
					>
						Strona Główna
					</Button>
				{:else if status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR}
					<Button
						variant="red"
						size="error_button"
						classes="transform font-semibold shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-red-500/25 rounded-2xl"
						onclick={handleRefresh}
						icon={RefreshCwIcon}
					>
						Odśwież Stronę
					</Button>

					<Button
						variant="red_secondary"
						size="error_button"
						classes="transform font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-105 rounded-2xl"
						onclick={handleGoHome}
						icon={HomeIcon}
					>
						Strona Główna
					</Button>
				{:else}
					<Button
						variant="red"
						size="error_button"
						classes="transform font-semibold shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-red-500/25 rounded-2xl"
						onclick={handleGoBack}
					>
						Wróć
					</Button>

					<Button
						variant="red_secondary"
						size="error_button"
						classes="transform font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-105 rounded-2xl"
						onclick={handleGoHome}
						icon={HomeIcon}
					>
						Strona Główna
					</Button>
				{/if}
			</div>

			<!-- Help Text -->
			<div class="mt-12 {isVisible ? 'animate-float-in-delayed-3' : 'translate-y-8 opacity-0'}">
				<p class="text-gray-400">
					Jeśli problem będzie się powtarzał, skontaktuj się z naszym
					<a
						href="mailto:support@pansamochodzik.pl"
						class="text-red-400 underline transition-colors hover:text-red-300"
					>
						zespołem wsparcia
					</a>
				</p>
			</div>
		</div>

		<!-- Floating Automotive Elements -->
		{#if isVisible}
			<!-- Top floating wrench -->
			<div class="animate-float-slow absolute -right-4 top-8 opacity-15 sm:-right-8 sm:top-12">
				<WrenchIcon class="h-16 w-16 rotate-12 transform text-red-500 sm:h-20 sm:w-20" />
			</div>

			<!-- Bottom left floating car -->
			<div
				class="animate-float-medium absolute -bottom-8 -left-8 opacity-20 sm:-bottom-12 sm:-left-12"
			>
				<CarIcon class="h-12 w-12 text-red-600 sm:h-16 sm:w-16" />
			</div>

			<!-- Top left floating gear -->
			<div class="animate-float-reverse absolute -left-6 top-1/4 opacity-10 sm:-left-10">
				<SettingsIcon class="animate-spin-slow h-10 w-10 text-gray-500 sm:h-12 sm:w-12" />
			</div>

			<!-- Right side floating wrench -->
			<div class="animate-float-fast absolute -right-8 bottom-1/4 opacity-15">
				<WrenchIcon class="h-8 w-8 -rotate-45 transform text-gray-400 sm:h-10 sm:w-10" />
			</div>

			<!-- Additional decorative elements -->
			<div class="animate-float-slow absolute right-1/4 top-16 opacity-10 sm:top-20">
				<SettingsIcon class="h-6 w-6 rotate-45 transform text-red-300 sm:h-8 sm:w-8" />
			</div>

			<div class="animate-float-reverse absolute bottom-16 left-1/4 opacity-15">
				<CarIcon class="h-8 w-8 rotate-12 transform text-gray-600 sm:h-10 sm:w-10" />
			</div>
		{/if}
	</div>

	<!-- Brand Footer -->
	<footer class="relative z-10 px-4 py-8">
		<div class="mx-auto max-w-4xl text-center">
			<div class="mb-4 flex items-center justify-center space-x-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
					<CarIcon class="h-4 w-4 text-white" />
				</div>
				<span class="text-xl font-bold text-white">Pan Samochodzik</span>
			</div>
			<p class="text-sm text-gray-500">Twój cyfrowy asystent motoryzacyjny</p>
		</div>
	</footer>
</div>

<style>
	/* Import existing animations from the landing page and add new ones */
	@keyframes float-slow {
		0%,
		100% {
			transform: translateY(0px) rotate(12deg);
		}
		50% {
			transform: translateY(-20px) rotate(12deg);
		}
	}

	@keyframes float-medium {
		0%,
		100% {
			transform: translateY(0px) scale(1);
		}
		33% {
			transform: translateY(-15px) scale(1.05);
		}
		66% {
			transform: translateY(-8px) scale(0.95);
		}
	}

	@keyframes float-fast {
		0%,
		100% {
			transform: translateY(0px) translateX(0px);
		}
		25% {
			transform: translateY(-10px) translateX(5px);
		}
		50% {
			transform: translateY(-5px) translateX(-3px);
		}
		75% {
			transform: translateY(-12px) translateX(2px);
		}
	}

	@keyframes float-reverse {
		0%,
		100% {
			transform: translateY(0px) rotate(-45deg);
		}
		50% {
			transform: translateY(15px) rotate(-45deg);
		}
	}

	@keyframes spin-slow {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes spin-reverse-slow {
		0% {
			transform: rotate(360deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	@keyframes float-in {
		0% {
			opacity: 0;
			transform: translateY(30px) scale(0.9);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes float-in-delayed {
		0% {
			opacity: 0;
			transform: translateY(30px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-float-slow {
		animation: float-slow 6s ease-in-out infinite;
	}

	.animate-float-medium {
		animation: float-medium 4s ease-in-out infinite;
	}

	.animate-float-fast {
		animation: float-fast 3s ease-in-out infinite;
	}

	.animate-float-reverse {
		animation: float-reverse 5s ease-in-out infinite;
	}

	.animate-spin-slow {
		animation: spin-slow 8s linear infinite;
	}

	.animate-spin-reverse-slow {
		animation: spin-reverse-slow 10s linear infinite;
	}

	.animate-float-in {
		animation: float-in 0.8s ease-out forwards;
	}

	.animate-float-in-delayed {
		animation: float-in-delayed 0.8s ease-out 0.2s forwards;
		opacity: 0;
	}

	.animate-float-in-delayed-2 {
		animation: float-in-delayed 0.8s ease-out 0.4s forwards;
		opacity: 0;
	}

	.animate-float-in-delayed-3 {
		animation: float-in-delayed 0.8s ease-out 0.6s forwards;
		opacity: 0;
	}
</style>
