<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import CarIcon from 'lucide-svelte/icons/car';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';

	let { form } = $props();
	let isRegistering = $state(false);
</script>

<svelte:head>
	<title>Zaloguj się - Pan Samochodzik</title>
	<meta
		name="description"
		content="Zaloguj się do Pan Samochodzik - Twój Cyfrowy Asystent Motoryzacyjny"
	/>
</svelte:head>

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
>
	<!-- Navigation -->
	<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<a href="/" class="flex items-center space-x-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/25"
				>
					<CarIcon class="h-6 w-6 text-white" />
				</div>
				<span class="text-2xl font-bold text-white">Pan Samochodzik</span>
			</a>
		</div>
	</nav>

	<!-- Login Section -->
	<section class="relative z-10 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
		<div class="w-full max-w-md">
			<div class="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl shadow-red-600/10">
				<div class="mb-8 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-600 bg-red-600/20"
					>
						<CarIcon class="h-8 w-8 text-red-400" />
					</div>
					<h1 class="text-3xl font-bold text-white">
						{isRegistering ? 'Załóż konto' : 'Zaloguj się'}
					</h1>
					<p class="mt-2 text-gray-400">
						{isRegistering
							? 'Dołącz do społeczności Pan Samochodzik'
							: 'Wróć do swojego cyfrowego asystenta motoryzacyjnego'}
					</p>
				</div>

				<form
					method="post"
					action={isRegistering ? '?/register' : '?/login'}
					use:enhance={({ formData, cancel }) => {
						console.log('Form submitted', formData.get('username'));
						return async ({ result }) => {
							console.log('Form result', result);
							if (result.type === 'redirect') {
								goto(result.location);
							}
						};
					}}
					class="space-y-6"
				>
					<Input
						name="username"
						id="username"
						type="text"
						required
						label="Nazwa użytkownika"
						placeholder="Wprowadź swoją nazwę użytkownika"
					/>

					<Input
						name="password"
						id="password"
						type="password"
						required
						label="Hasło"
						placeholder="Wprowadź swoje hasło"
					/>

					{#if isRegistering}
						<div>
							<label class="block text-sm font-medium text-gray-300"> Rola </label>
							<select
								name="role"
								required
								class="mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white shadow-sm transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
							>
								<option value="">Wybierz rolę</option>
								<option value="CLIENT">Klient (szukam mechanika)</option>
								<option value="MECHANIC">Mechanik (oferuję usługi)</option>
							</select>
						</div>
					{/if}

					<div class="space-y-4">
						<Button
							type="submit"
							variant="red"
							size="full_width"
							classes="transform shadow-lg shadow-red-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-700/25"
						>
							{isRegistering ? 'Załóż konto' : 'Zaloguj się'}
						</Button>

						<Button
							type="button"
							onClick={() => (isRegistering = !isRegistering)}
							variant="red_secondary"
							size="full_width"
							classes="font-semibold transition-all duration-300"
						>
							{isRegistering ? 'Mam już konto - Zaloguj' : 'Załóż nowe konto'}
						</Button>
					</div>
				</form>

				{#if form?.success}
					<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
						<p class="text-sm text-green-300">Login successful! Role: {form.role}</p>
						<a
							href={form.role === 'MECHANIC' ? '/mechanic' : '/client'}
							class="mt-2 inline-block text-blue-400 underline"
						>
							Go to dashboard
						</a>
					</div>
				{/if}

				{#if form?.message}
					<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
						<p class="text-sm text-red-300">{form.message}</p>
					</div>
				{/if}

				<div class="mt-8 text-center">
					<p class="text-sm text-gray-400">
						Nie masz jeszcze konta?
						<a href="/register" class="font-medium text-red-400 hover:text-red-300">
							Zarejestruj się tutaj
						</a>
					</p>
				</div>
			</div>

			<!-- Floating elements for visual appeal -->
			<div
				class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 animate-bounce rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-30"
			></div>
			<div
				class="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-20"
			></div>
		</div>
	</section>
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
