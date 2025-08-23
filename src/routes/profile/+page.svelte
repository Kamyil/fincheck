<script lang="ts">
	import { getUserProfile, updateUserProfile, logoutUser } from '$lib/user/data.remote';
	import Button from '$lib/components/common/Button.svelte';
</script>

<svelte:boundary>
	<div class="container mx-auto p-8">
		<h1 class="mb-6 text-3xl font-bold">Your Profile</h1>

		{#key getUserProfile().current}
			{@const profile = await getUserProfile()}

			<form {...updateUserProfile}>
				<div class="mb-4">
					<label class="mb-2 block">
						Username
						<input
							name="username"
							class="w-full rounded border px-4 py-2"
							value={profile.username}
						/>
					</label>
				</div>

				<div class="mb-6">
					<label class="mb-2 block">
						Email
						<input
							name="email"
							type="email"
							class="w-full rounded border px-4 py-2"
							value={profile.email}
						/>
					</label>
				</div>

				<div class="flex gap-4">
					<Button variant="blue" type="submit">Save Profile</Button>

					<Button type="button" variant="red" onClick={() => logoutUser()}>Logout</Button>
				</div>
			</form>

			{#if updateUserProfile.result?.success}
				<div class="mt-4 rounded bg-green-100 p-3 text-green-800">
					Profile successfully updated!
				</div>
			{:else if updateUserProfile.result?.invalid}
				<div class="mt-4 rounded bg-red-100 p-3 text-red-800">
					{updateUserProfile.result.message}
				</div>
			{/if}
		{/key}
	</div>

	{#snippet pending()}
		<div class="container mx-auto flex items-center justify-center p-8">
			<div class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
		</div>
	{/snippet}
</svelte:boundary>
