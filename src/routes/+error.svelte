<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import HomeIcon from 'lucide-svelte/icons/home';
	import RefreshCwIcon from 'lucide-svelte/icons/refresh-cw';
	import AlertTriangleIcon from 'lucide-svelte/icons/alert-triangle';
	import Button from '$lib/components/common/Button.svelte';
	import { HTTP_STATUS_CODE } from '$lib/httpStatusCodes';

	let isVisible = $state(false);

	onMount(() => {
		isVisible = true;
	});

	let status = $derived($page.status);
	let error = $derived($page.error);

	const errorMessages: Record<number, { title: string; description: string }> = {
		[HTTP_STATUS_CODE.BAD_REQUEST]: {
			title: 'Bad Request',
			description: 'Please check your input and try again.'
		},
		[HTTP_STATUS_CODE.UNAUTHORIZED]: {
			title: 'Unauthorized',
			description: 'You need to be logged in to access this page.'
		},
		[HTTP_STATUS_CODE.FORBIDDEN]: {
			title: 'Forbidden',
			description: "You don't have permission to view this page."
		},
		[HTTP_STATUS_CODE.NOT_FOUND]: {
			title: 'Page Not Found',
			description: "The page you're looking for doesn't exist or has been moved."
		},
		[HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR]: {
			title: 'Server Error',
			description: 'Something went wrong on our end. Please try again later.'
		},
		[HTTP_STATUS_CODE.SERVICE_UNAVAILABLE]: {
			title: 'Service Unavailable',
			description: 'The service is temporarily unavailable. Please try again in a few minutes.'
		}
	};

	let errorInfo = $derived(
		errorMessages[status] || {
			title: 'Something Went Wrong',
			description: 'An unexpected error occurred. Please try again.'
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
	<title>Error {status}</title>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-gray-900">
	<div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
		<div class="mx-auto max-w-2xl text-center">
			<!-- Error Icon -->
			<div class="mb-8 {isVisible ? 'animate-fade-in' : 'opacity-0'}">
				<div class="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
					<div class="absolute inset-0 animate-pulse rounded-full border-4 border-red-600/20"></div>
					<div
						class="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/25"
					>
						<AlertTriangleIcon class="h-8 w-8 text-white" />
					</div>
					<div
						class="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-600 bg-gray-800 shadow-lg"
					>
						<span class="text-xs font-bold text-red-400">{status}</span>
					</div>
				</div>
			</div>

			<!-- Error Message -->
			<div class="mb-10 space-y-4 {isVisible ? 'animate-fade-in-delayed' : 'opacity-0'}">
				<h1 class="text-3xl font-bold text-white sm:text-4xl">
					{errorInfo.title}
				</h1>

				<p class="text-lg text-gray-300">
					{errorInfo.description}
				</p>

				{#if error?.message && error.message !== errorInfo.description}
					<div class="mt-4 rounded-lg border border-red-600/30 bg-red-900/20 p-4">
						<p class="text-sm text-red-300">
							<strong>Details:</strong>
							{error.message}
						</p>
					</div>
				{/if}
			</div>

			<!-- Action Buttons -->
			<div
				class="flex flex-col gap-4 sm:flex-row sm:justify-center {isVisible
					? 'animate-fade-in-delayed-2'
					: 'opacity-0'}"
			>
				{#if status === HTTP_STATUS_CODE.NOT_FOUND}
					<Button
						variant="red"
						size="error_button"
						classes="rounded-xl font-semibold"
						onclick={handleGoHome}
						icon={HomeIcon}
					>
						Go Home
					</Button>
				{:else if status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR}
					<Button
						variant="red"
						size="error_button"
						classes="rounded-xl font-semibold"
						onclick={handleRefresh}
						icon={RefreshCwIcon}
					>
						Refresh Page
					</Button>

					<Button
						variant="red_secondary"
						size="error_button"
						classes="rounded-xl font-semibold"
						onclick={handleGoHome}
						icon={HomeIcon}
					>
						Go Home
					</Button>
				{:else}
					<Button
						variant="red"
						size="error_button"
						classes="rounded-xl font-semibold"
						onclick={handleGoBack}
					>
						Go Back
					</Button>

					<Button
						variant="red_secondary"
						size="error_button"
						classes="rounded-xl font-semibold"
						onclick={handleGoHome}
						icon={HomeIcon}
					>
						Go Home
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
	}

	.animate-fade-in-delayed {
		animation: fade-in 0.6s ease-out 0.15s forwards;
		opacity: 0;
	}

	.animate-fade-in-delayed-2 {
		animation: fade-in 0.6s ease-out 0.3s forwards;
		opacity: 0;
	}
</style>
