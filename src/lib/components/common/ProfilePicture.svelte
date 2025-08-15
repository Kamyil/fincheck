<script lang="ts" module>
    export let sizes = {
        extraSmall: "w-[24px] h-[24px] border-2",
        smaller: "w-[30px] h-[30px] border-[3px]",
        small: "w-[40px] h-[40px] border-4",
        medium: "w-[64px] h-[64px] border-4",
        large: "w-[96px] h-[96px] border-4",
    } as const;

    export let sizesPx: Record<keyof typeof sizes, number> = {
        extraSmall: 24,
        smaller: 30,
        small: 40,
        medium: 64,
        large: 96,
    } as const;
</script>

<script lang="ts">
    import { run } from 'svelte/legacy';

    import type { User } from "$lib/api";

    import { COLORS } from "$lib/colors";
    import RaptorImage from "$lib/images/raptor.png";
    import { twMerge } from "tailwind-merge";
    import WithTooltip from "./WithTooltip.svelte";
    import ProfilePicturePlaceholder from "$lib/images/profile-picture-placeholder.png";

    
    



    
    
    


    

    interface Props {
        /** Person object. If passed, ProfilePicture component automatically infers border color, image path and names to display in the hover tooltip */
        person?: Pick<User, "image_path" | "color" | "first_name" | "last_name"> | null | undefined;
        /**
     * URL for the image. Can be either internal one or external link
     */
        imageUrl?: string | null | undefined;
        alt?: string;
        /**
     * The color of the border. Accepts only a defined set of colors defined in `colors.ts`
     */
        borderColor?: keyof typeof COLORS | "";
        /**
     * Standard prop for modyfing component's look using Tailwind classes
     */
        classes?: string;
        /**
     * Adds shadow and hover&active mouse states animations
     * giving user a hint that he can click on this `ProfilePicture`
     */
        clickable?: boolean;
        showPersonNameOnHover?: any;
        /**
     * Size of the picture. Can be overriden via `h-` and `w-` tailwind classes
     * It's seto to `sm` by default
     */
        size?: keyof typeof sizes;
        onClick?: (
        event: (MouseEvent | KeyboardEvent) & {
            currentTarget: EventTarget & HTMLImageElement;
        },
    ) => void;
        children?: import('svelte').Snippet;
    }

    let {
        person = undefined,
        imageUrl = $bindable(person?.image_path ? `/api/storage/${person?.image_path}` : ProfilePicturePlaceholder),
        alt = "",
        borderColor = person?.color ?? "",
        classes = "",
        clickable = false,
        showPersonNameOnHover = !!person?.first_name,
        size = "small",
        onClick = () => {},
        children
    }: Props = $props();
    run(() => {
        if(person?.image_path){
            imageUrl = `/api/storage/${person?.image_path}`;
        }
    });
</script>

<!--TODO: a new default picture-->
{#if person && showPersonNameOnHover}
    <WithTooltip group="profile-picture">
        {#snippet trigger()}
                <span >
                <img
                    src={imageUrl ?? RaptorImage}
                    {alt}
                    class={twMerge(
                        sizes[size],
                        "rounded-full shadow transition-all",
                        clickable ? "cursor-pointer hover:scale-105 active:scale-95" : "",
                        borderColor ? `${COLORS[borderColor].BORDER}` : "",
                        classes,
                    )}
                    onclick={(event) => onClick(event)}
                    role="presentation"
                />
            </span>
            {/snippet}
        {#snippet content()}
                <span >
                {#if children}{@render children()}{:else}
                    {person.first_name} {person.last_name}
                {/if}
            </span>
            {/snippet}
    </WithTooltip>
{:else}
    <img
        src={imageUrl ?? RaptorImage}
        {alt}
        class={twMerge(
            sizes[size],
            "rounded-full shadow transition-all",
            clickable ? "cursor-pointer hover:scale-105 active:scale-95" : "",
            borderColor ? `${COLORS[borderColor].BORDER}` : "",
            classes,
        )}
        onclick={(event) => onClick(event)}
        role="presentation"
    />
{/if}
