<script lang="ts">
	import { getUserProfile, updateUserProfile, logoutUser } from '$lib/user/data.remote';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';
</script>

<svelte:boundary>
	<div class="container mx-auto p-8">
		<h1 class="mb-6 text-3xl font-bold">Your Profile</h1>

		{#await getUserProfile()}
			<div class="container mx-auto flex items-center justify-center p-8">
				<div
					class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"
				></div>
			</div>
		{:then profile}
			<form {...updateUserProfile}>
				<div class="mb-4">
					<Input
						name="username"
						id="username"
						label="Username"
						form={updateUserProfile}
						value={profile.username}
						classes="w-full rounded border px-4 py-2"
					/>
				</div>

				<div class="mb-6">
					<Input
						name="email"
						id="email"
						label="Email"
						type="email"
						form={updateUserProfile}
						value={profile.email}
						classes="w-full rounded border px-4 py-2"
					/>
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
			{:else if updateUserProfile.result?.error}
				<div class="mt-4 rounded bg-red-100 p-3 text-red-800">
					{updateUserProfile.result.error}
				</div>
			{:else if updateUserProfile.result?.errors}
				<div class="mt-4 rounded bg-red-100 p-3 text-red-800">
					Please check the form fields - there are validation errors.
				</div>
			{/if}
		{/await}
	</div>

	{#snippet pending()}
		<div class="container mx-auto flex items-center justify-center p-8">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
		</div>
	{/snippet}
</svelte:boundary>
