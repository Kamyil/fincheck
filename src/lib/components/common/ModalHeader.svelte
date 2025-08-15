<script lang="ts">
    interface Props {
        onClose?: () => void;
        children?: import("svelte").Snippet;
    }

    let { onClose = () => history.back(), children }: Props = $props();

    const handleClose = () => {
        onClose();
    };
</script>

<div class="flex p-4 items-center">
    <h2 class="text-lg font-bold self-center">
        {@render children?.()}
    </h2>
    <button onclick={handleClose} class="text-gray-500 ml-auto">
        <span class="text-2xl">&times;</span>
    </button>
</div>
