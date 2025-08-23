<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import Section from '$lib/components/common/Section.svelte';
	import ProfilePicture from '$lib/components/common/ProfilePicture.svelte';
	import MccomLogo from '$lib/components/common/MccomLogo.svelte';
	import StLogo from '$lib/components/common/StLogo.svelte';
	import LogOutIcon from 'lucide-svelte/icons/log-out';
	import { page } from '$app/state';

	let currentRoute = $derived(page.route.id);
	let user = $derived(page.data.user);
</script>

<Section classes="p-2 flex overflow-x-auto shadow-lg bg-gray-600 justify-betwen items-center">
	<div class="flex h-full w-3/4 items-center justify-start text-center">
		<div class="">
			<div class="flex w-full justify-center">
				<StLogo classes="mx-10" />
			</div>
		</div>

		<div class="align-items-end flex flex-row gap-x-2 text-sm">
			<SidebarItem
				redirectsTo={'/delivery'}
				isActive={currentRoute?.includes('/(authenticated)/(shipmentTab)')}
			>
				<span>Wysyłka</span>
			</SidebarItem>

			<SidebarItem
				redirectsTo={'/in-transit'}
				isActive={currentRoute?.includes('/(authenticated)/(carriersTab)')}
			>
				<span>Transport przewoźników</span>
			</SidebarItem>

			<SidebarItem
				redirectsTo={'/operators'}
				isActive={currentRoute?.includes('/(authenticated)/(operatorsTab)')}
			>
				<span>Użytkownicy</span>
			</SidebarItem>

			<SidebarItem
				redirectsTo={'/settings'}
				isActive={currentRoute?.includes('/(authenticated)/(settingsTab)')}
			>
				<div>Ustawienia</div>
			</SidebarItem>

			<form method="POST" action="/logout" style="display: contents;">
				<button
					type="submit"
					class="hover:bg-primary flex h-10 cursor-pointer items-center rounded-md fill-gray-100 stroke-gray-100 text-sm font-normal text-gray-100 transition-all hover:shadow-md active:scale-95"
				>
					<div class="mx-5 flex w-full items-center">
						<LogOutIcon size={12} />
						<span class="mx-1"> </span>
						<span>Wyloguj się</span>
					</div>
				</button>
			</form>
		</div>
	</div>

	<div class="flex w-1/4 justify-end space-x-4">
		<a href="/my-panel" class="flex items-center">
			<ProfilePicture
				person={user}
				showPersonNameOnHover={false}
				clickable={true}
				alt="Zdjęcie profilowe"
				size="small"
			/>
			<div class="ml-3 flex flex-col text-xs">
				<span class="font-semibold text-gray-300">
					{user?.first_name}
					{user?.last_name}
				</span>
				<span class="text-xs font-normal text-gray-400">
					{user?.is_admin ? 'Administrator' : 'Użytkownik'}
				</span>
			</div>
		</a>

		<div class="text-2xs mr-5 flex h-full flex-col items-center justify-end text-center">
			<div class="mb-1 text-gray-300">Powered by</div>
			<div class="flex w-full justify-center">
				<MccomLogo classes="w-20" />
			</div>
		</div>
	</div>
</Section>
