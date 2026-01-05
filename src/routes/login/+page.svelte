<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import UserIcon from 'lucide-svelte/icons/user';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';

	let { form } = $props();
	let isRegistering = $state(false);
</script>

<svelte:head>
	<title>{isRegistering ? 'Register' : 'Login'} - App</title>
	<meta name="description" content="Login or register for your account" />
</svelte:head>

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
>
	<!-- Navigation -->
	<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<a href="/" class="flex items-center space-x-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25"
				>
					<UserIcon class="h-6 w-6 text-white" />
				</div>
				<span class="text-2xl font-bold text-white">App</span>
			</a>
		</div>
	</nav>

	<!-- Login Section -->
	<section class="relative z-10 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
		<div class="w-full max-w-md">
			<div class="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl shadow-blue-600/10">
				<div class="mb-8 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-600 bg-blue-600/20"
					>
						<UserIcon class="h-8 w-8 text-blue-400" />
					</div>
					<h1 class="text-3xl font-bold text-white">
						{isRegistering ? 'Create Account' : 'Welcome Back'}
					</h1>
					<p class="mt-2 text-gray-400">
						{isRegistering ? 'Sign up to get started' : 'Sign in to your account'}
					</p>
				</div>

				<form
					method="post"
					action={isRegistering ? '?/register' : '?/login'}
					use:enhance={({ formData, cancel }) => {
						return async ({ result }) => {
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
						label="Username"
						placeholder="Enter your username"
					/>

					<Input
						name="password"
						id="password"
						type="password"
						required
						label="Password"
						placeholder="Enter your password"
					/>

					<div class="space-y-4">
						<Button
							type="submit"
							variant="blue"
							size="full_width"
							classes="transform shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/25"
						>
							{isRegistering ? 'Create Account' : 'Sign In'}
						</Button>

						<Button
							type="button"
							onClick={() => {
								isRegistering = !isRegistering;
							}}
							variant="gray_outline"
							size="full_width"
							classes="font-semibold transition-all duration-300"
						>
							{isRegistering ? 'Already have an account? Sign In' : 'Create new account'}
						</Button>
					</div>
				</form>

				{#if form?.message}
					<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
						<p class="text-sm text-red-300">{form.message}</p>
					</div>
				{/if}
			</div>
		</div>
	</section>
</div>
