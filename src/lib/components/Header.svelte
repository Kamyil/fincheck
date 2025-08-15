<script lang="ts">
    import SidebarItem from "./SidebarItem.svelte";
    import Section from "$lib/components/common/Section.svelte";
    import ProfilePicture from "$lib/components/common/ProfilePicture.svelte";
    import MccomLogo from "$lib/components/common/MccomLogo.svelte";
    import StLogo from "$lib/components/common/StLogo.svelte";
    import LogOutIcon from "lucide-svelte/icons/log-out";
    import { page } from "$app/state";

    let currentRoute = $derived(page.route.id);
    let user = $derived(page.data.user);
</script>

<Section classes="p-2 flex overflow-x-auto shadow-lg bg-gray-600 justify-betwen items-center">
    <div class="h-full flex items-center justify-start text-center w-3/4">
        <div class="">
            <div class="w-full flex justify-center">
                <StLogo classes="mx-10" />
            </div>
        </div>

        <div class="text-sm flex flex-row align-items-end gap-x-2">
            <SidebarItem redirectsTo={"/delivery"} isActive={currentRoute?.includes("/(authenticated)/(shipmentTab)")}>
                <span>Wysyłka</span>
            </SidebarItem>

            <SidebarItem redirectsTo={"/in-transit"} isActive={currentRoute?.includes("/(authenticated)/(carriersTab)")}>
                <span>Transport przewoźników</span>
            </SidebarItem>

            <SidebarItem redirectsTo={"/operators"} isActive={currentRoute?.includes("/(authenticated)/(operatorsTab)")}>
                <span>Użytkownicy</span>
            </SidebarItem>

            <SidebarItem redirectsTo={"/settings"} isActive={currentRoute?.includes("/(authenticated)/(settingsTab)")}>
                <div>Ustawienia</div>
            </SidebarItem>

            <SidebarItem redirectsTo={"/logout"} rel="external">
                <LogOutIcon size={12} />
                <span class="mx-1"> </span>
                <span>Wyloguj się</span>
            </SidebarItem>
        </div>
    </div>

    <div class="flex w-1/4 justify-end space-x-4">
        <a href="/my-panel" class="flex items-center">
            <ProfilePicture person={user} showPersonNameOnHover={false} clickable={true} alt="Zdjęcie profilowe" size="small" />
            <div class="flex flex-col text-xs ml-3">
                <span class="font-semibold text-gray-300">
                    {user?.first_name}
                    {user?.last_name}
                </span>
                <span class="text-gray-400 font-normal text-xs">
                    {user?.is_admin ? "Administrator" : "Użytkownik"}
                </span>
            </div>
        </a>

        <div class="h-full flex flex-col items-center justify-end text-center mr-5 text-2xs">
            <div class="mb-1 text-gray-300">Powered by</div>
            <div class="w-full flex justify-center">
                <MccomLogo classes="w-20" />
            </div>
        </div>
    </div>
</Section>
