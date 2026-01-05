<script>
	import ZapIcon from 'lucide-svelte/icons/zap';
	import ShieldIcon from 'lucide-svelte/icons/shield';
	import RocketIcon from 'lucide-svelte/icons/rocket';
	import UserIcon from 'lucide-svelte/icons/user';
	import Button from '$lib/components/common/Button.svelte';
</script>

<svelte:head>
	<title>App - Modern SvelteKit Starter</title>
	<meta name="description" content="A modern SvelteKit application with authentication" />
</svelte:head>

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
>
	<nav class="relative z-50 mx-4 px-4 py-6 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div class="flex items-center space-x-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25"
				>
					<ZapIcon class="h-6 w-6 text-white" />
				</div>
				<span class="text-2xl font-bold text-white">App</span>
			</div>

			<div class="flex items-center space-x-4">
				<a href="/login" class="font-medium text-gray-300 transition-colors hover:text-blue-400">
					Sign In
				</a>
				<a href="/login">
					<Button
						variant="blue"
						classes="transform shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/25"
					>
						Get Started
					</Button>
				</a>
			</div>
		</div>
	</nav>

	<section
		class="relative mx-4 overflow-hidden px-4 py-16 sm:mx-6 sm:px-6 sm:py-20 lg:mx-8 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
				Build something
				<span class="text-blue-500">amazing</span>
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
				A modern SvelteKit starter with authentication, database integration, and everything you
				need to ship fast.
			</p>

			<div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:gap-6">
				<a
					href="/login"
					class="transform rounded-2xl bg-blue-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/25"
				>
					Get Started
				</a>
				<a
					href="https://github.com"
					class="rounded-2xl border-2 border-gray-600 px-8 py-4 text-center text-lg font-semibold text-gray-300 transition-all duration-300 hover:border-blue-600 hover:text-white"
				>
					View on GitHub
				</a>
			</div>
		</div>
	</section>

	<section
		class="mx-4 my-8 border border-gray-800 bg-gray-900 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">Features</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-300">
					Everything you need to build modern web applications
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<div
					class="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-blue-600"
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">
						<ZapIcon class="h-6 w-6 text-blue-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">Fast by Default</h3>
					<p class="text-gray-400">
						Built on SvelteKit with server-side rendering and optimized for performance.
					</p>
				</div>

				<div
					class="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-blue-600"
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/20">
						<ShieldIcon class="h-6 w-6 text-green-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">Secure Auth</h3>
					<p class="text-gray-400">
						Session-based authentication with secure password hashing using Argon2.
					</p>
				</div>

				<div
					class="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-blue-600"
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
						<RocketIcon class="h-6 w-6 text-purple-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-white">Ready to Deploy</h3>
					<p class="text-gray-400">
						Containerized with Docker, includes database migrations and CI/CD ready.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section
		class="mx-4 my-8 bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-16 sm:mx-6 sm:my-12 sm:px-6 sm:py-20 lg:mx-8 lg:my-16 lg:px-8"
	>
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
			<p class="mb-8 text-lg text-blue-100">Create your account and start building today.</p>
			<a
				href="/login"
				class="inline-block transform rounded-2xl bg-white px-10 py-4 text-lg font-semibold text-blue-600 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100"
			>
				Create Account
			</a>
		</div>
	</section>

	<footer
		class="mx-4 mb-8 mt-8 bg-black px-4 py-12 sm:mx-6 sm:mb-12 sm:mt-12 sm:px-6 lg:mx-8 lg:mb-16 lg:mt-16 lg:px-8"
	>
		<div class="mx-auto max-w-6xl">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 flex items-center space-x-3 md:mb-0">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
						<ZapIcon class="h-5 w-5 text-white" />
					</div>
					<span class="text-2xl font-bold text-white">App</span>
				</div>

				<div class="text-center text-gray-400 md:text-right">
					<p>&copy; 2025 App. All rights reserved.</p>
				</div>
			</div>
		</div>
	</footer>
</div>
