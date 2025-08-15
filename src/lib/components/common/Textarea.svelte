<!--
 @component Textarea

Handy abstraction over standard <textarea> html element with extra features
-->
<script lang="ts">
    import { onMount } from "svelte";
    import { twMerge } from "tailwind-merge";

    let variants = {
        transparent: "border-none ",
        "with-shadow": "border-none shadow-md",
        "with-border": "border-1 rounded border-stone-200",
    } as const;

    let labelInstance: HTMLLabelElement = $state();
    let inputRef: HTMLTextAreaElement = $state();

    interface Props {
        rows?: HTMLTextAreaElement["rows"] | undefined;
        id?: string | undefined;
        name?: string | undefined;
        /** Normal value that can be binded to any variable */
        value: string | null;
        label?: string;
        variant?: keyof typeof variants;
        resizable?: boolean;
        classes?: string;
        placeholder?: string;
        /** When true it will automatically focus the input allowing user to type into textarea right away  */
        focused?: boolean;
        /** Optional hint that will be attached on bottom of the input */
        hint?: string;
        /** Do not use it unless you really know what you're doing ;) */
        dunkMode?: boolean;
        letterTracker?: { min: number; limit: number } | undefined;
        onChange?: (
            event: Event & {
                currentTarget: EventTarget & HTMLTextAreaElement;
            },
        ) => void;
        onInput?: (
            event: Event & {
                currentTarget: EventTarget & HTMLTextAreaElement;
            },
        ) => void;
        onFocusIn?: (
            event: Event & {
                currentTarget: EventTarget & HTMLTextAreaElement;
            },
        ) => void;
        onFocusOut?: (
            event: Event & {
                currentTarget: EventTarget & HTMLTextAreaElement;
            },
        ) => void;
    }

    let {
        rows = undefined,
        id = undefined,
        name = id,
        value = $bindable(),
        label = "",
        variant = "transparent",
        resizable = false,
        classes = "",
        placeholder = "Zacznij pisać...",
        focused = false,
        hint = "",
        dunkMode = false,
        letterTracker = undefined,
        onChange = () => {},
        onInput = () => {},
        onFocusIn = () => {},
        onFocusOut = () => {},
    }: Props = $props();

    onMount(() => {
        if (focused) {
            inputRef.focus();
        }
    });
    let length = $derived(value?.length ?? 0);
</script>

<div>
    {#if label}
        <label for={id} class="mt-2 mb-1 ml-2 block text-xs font-medium text-zinc-500" bind:this={labelInstance}>
            {label}
        </label>
    {/if}
    <textarea
        {id}
        {name}
        bind:this={inputRef}
        bind:value
        {rows}
        class={twMerge("w-full h-full rounded text-xs", variants[variant], classes)}
        class:resize-none={resizable}
        onchange={(event) => onChange(event)}
        oninput={(event) => {
            onInput(event);
        }}
        onfocusin={onFocusIn}
        onfocusout={onFocusOut}
        {placeholder}
        aria-placeholder={placeholder}
    ></textarea>

    {#if letterTracker}
        {#if dunkMode}
            <span
                class="text-xs relative float-right bottom-10 p-2"
                style="
                    color: rgb({length * 10}, 0, 0);
                    font-size: {length}px;
                    transform: rotate({(length * length) / 10}deg);
                "
            >
                {length} / {letterTracker.limit}
            </span>
        {:else}
            <span class="text-xs float-right mb-4 p-2" class:text-red-600={length > letterTracker.limit}>
                {length} / {letterTracker.limit}
            </span>
        {/if}
    {/if}

    {#if hint}
        <span class="mt-1 mb-2 ml-2 block text-sm text-green-800">
            {hint}
        </span>
    {/if}
</div>
