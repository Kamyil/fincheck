<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUserProfile, updateUserProfile } from '$lib/user/data.remote';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import UserIcon from 'lucide-svelte/icons/user';
	import LogOutIcon from 'lucide-svelte/icons/log-out';

	function handleLogout() {
		goto('/logout');
	}
</script>

<svelte:head>
	<title>Profile - App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
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
			<Button variant="gray_outline" onClick={handleLogout} icon={LogOutIcon}>Logout</Button>
		</div>
	</nav>

	<svelte:boundary>
		<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl">
				<h1 class="mb-8 text-3xl font-bold text-white">Your Profile</h1>

				{#await getUserProfile()}
					<div class="flex items-center justify-center py-12">
						<div
							class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"
						></div>
					</div>
				{:then profile}
					<form {...updateUserProfile} class="space-y-6">
						<Input
							name="username"
							id="username"
							label="Username"
							form={updateUserProfile}
							value={profile.username}
						/>

						<Input
							name="email"
							id="email"
							label="Email"
							type="email"
							form={updateUserProfile}
							value={profile.email}
						/>

						<div class="pt-4">
							<Button variant="blue" type="submit" size="full_width">Save Profile</Button>
						</div>
					</form>

					{#if updateUserProfile.result?.success}
						<div class="mt-6 rounded-lg border border-green-700 bg-green-900/20 p-4">
							<p class="text-sm text-green-300">Profile successfully updated!</p>
						</div>
					{:else if updateUserProfile.result?.error}
						<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
							<p class="text-sm text-red-300">{updateUserProfile.result.error}</p>
						</div>
					{:else if updateUserProfile.result?.errors}
						<div class="mt-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
							<p class="text-sm text-red-300">
								Please check the form fields - there are validation errors.
							</p>
						</div>
					{/if}
				{/await}
			</div>
		</div>

		{#snippet pending()}
			<div class="flex items-center justify-center py-12">
				<div
					class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"
				></div>
			</div>
		{/snippet}
	</svelte:boundary>
</div>
