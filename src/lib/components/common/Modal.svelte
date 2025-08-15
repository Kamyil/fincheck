<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import { onMount, type Snippet } from "svelte";
    import X from "lucide-svelte/icons/x";
    import Section from "$lib/components/common/Section.svelte";

    interface Props {
        title?: string;
        dialogElement?: HTMLDialogElement;
        classes?: string;
        beforeClose?: () => Promise<{ shouldCloseModal: boolean }>;
        onOpen?: () => void;
        onDismiss?: () => void;
        children?: Snippet;
    }

    let {
        title,
        dialogElement = $bindable(),
        classes = "",
        children,
        beforeClose = async () => {
            return { shouldCloseModal: true };
        },
        onOpen = () => {},
        onDismiss,
    }: Props = $props();

    /**
     * Controls the visibility of dialog/modal element
     * WARN: DO NOT EVER CHANGE THIS TO NATIVE dialog.showModal(), because showModal() does use it's own top layer
     * making notifications, tooltips and other popovers impossible to display over the modal
     */
    let open = $state(false);

    export function openModal() {
        if (!dialogElement) return;
        open = true;
        dialogElement.focus();

        // Register the Esc "by hand", because modal.show() does not do that by default
        document.addEventListener("keydown", function (e) {
            if (e.code === "Escape") closeModal();
        });

        if (onOpen) onOpen();
    }

    export async function closeModal() {
        if (!dialogElement) return;

        // Optionally run the beforeClose hook
        const { shouldCloseModal } = await beforeClose();
        if (!shouldCloseModal) return;

        // Add the "closing" class to trigger the fadeOut animation
        dialogElement.classList.add("closing");

        // Listen for the animationend event to know when fadeOut is done
        dialogElement.addEventListener("animationend", function handler(e) {
            // Remove the "closing" class and this event listener
            dialogElement!.classList.remove("closing");
            dialogElement!.removeEventListener("animationend", handler);
            // Finally, close the modal
            // dialogElement!.close();
            open = false;
        });
    }

    /**
        triggers onDismiss handler. Requries closing the modal manually,
        because this action triggers most likely with user's intention of cancelling anything he did inside the modal.
        So any handler should keep this in mind and handle request cancelation
    */
    export function dismissModal() {
        if (onDismiss) onDismiss();
    }

    /** Helper method that allows you to check if given instance of modal is currently open or not */
    export function isOpen() {
        return open;
    }

    onMount(() => {
        if (!document) return;
        // Close the modal if the backdrop (overlay) is clicked.
        document.querySelector("dialog")?.addEventListener("click", function (e) {
            if (e.target === e.currentTarget) {
                e.stopPropagation();
                closeModal();
            }
        });
    });
</script>

{#if open}
    <!-- custom backdrop -->
    <div
        class="fixed inset-0 bg-black/70 z-30 transition-opacity duration-250"
        onclick={() => {
            if (onDismiss) {
                onDismiss();
            } else {
                closeModal();
            }
        }}
    ></div>
{/if}

<dialog
    {open}
    bind:this={dialogElement}
    class={twMerge("w-3/4 p-5 bg-white rounded-md shadow-xl z-40 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 place-self-center", classes)}
    aria-modal="true"
>
    <Section classes="shadow-none h-3/4">
        <div class="flex justify-between items-center mb-5">
            <h1 class="text-primary font-semibold">{title}</h1>

            <button type="button" class="cursor-pointer" onclick={closeModal}>
                <X size={18} class="text-stone-500" />
            </button>
        </div>

        {@render children?.()}
    </Section>
</dialog>

<style>
    /* Default state (when closed) gets the fadeOut animation */
    dialog {
        animation: fadeOut 0.2s ease-in-out forwards;
        margin: auto;
        opacity: 0;
    }

    /* When open, the modal uses fadeIn */
    dialog[open] {
        animation: fadeIn 0.2s ease-in-out forwards;
        margin: auto;
        opacity: 1;
    }

    /* When we're closing, force the fadeOut animation even if [open] is still present */
    dialog.closing {
        animation: fadeOut 0.2s ease-in-out forwards;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(-1em);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-1em);
        }
    }
</style>
