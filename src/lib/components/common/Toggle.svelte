<script lang="ts" module>
    export let variants = {
        primary: "peer-checked:bg-primary",
        primary_without_bg:
            "bg-transparent after:bg-transparent border-1 border-stone-800 after:border-transparent after:bg-gray-600 peer-checked:bg-transparent peer-checked:border-stone-800 peer-checked:after:border-transparent peer-checked:after:bg-primary",
        success: "peer-checked:bg-green-600",
    } as const;
</script>

<script lang="ts">
    import { createBubbler } from "svelte/legacy";

    const bubble = createBubbler();
    import { twMerge } from "tailwind-merge";

    interface Props {
        classes?: string;
        id?: string | undefined;
        /** This is the prop of my component */
        variant?: keyof typeof variants;
        /** Speicifies if toggle should be turned on by default on load or not  */
        checked?: boolean;
        /** Defines if Toggle should be disabled or not */
        disabled?: boolean;
        children?: import("svelte").Snippet;
    }

    let { classes = "", id = undefined, variant = "primary_without_bg", checked = $bindable(false), disabled = false, children }: Props = $props();
</script>

<label class="relative inline-flex items-center cursor-pointer">
<!--    TODO: change it to bind:value -->
    <input type="checkbox" class="sr-only peer" bind:checked {disabled} aria-disabled={disabled} {id} onchange={bubble("change")} />
    <span
        class={twMerge(
            "w-[58px] h-8 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-focus:outline-none peer-focus:ring-4 peer peer-checked:after:border-white",
            !disabled ? "peer-checked:after:translate-x-full " : "",
            variants[variant],
            classes,
        )}
    ></span>
    <span class="ml-3 text-sm font-medium {disabled ? 'text-gray-300' : 'text-gray-900'}">{@render children?.()}</span>
</label>
