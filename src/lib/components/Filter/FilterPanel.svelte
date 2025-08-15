<script lang="ts">
    import Button from "$lib/components/common/Button.svelte";
    import Dropdown from "$lib/components/common/Dropdown.svelte";
    import FunnelIcon from "lucide-svelte/icons/funnel";
    import ListFilterPlusIcon from "lucide-svelte/icons/list-filter-plus";

    let buttonInstance = $state();

    interface Props {
        /**
         * Reference to the button element - used for binding
         */
        button?: HTMLButtonElement | null,

        /**
         * Additional css classes for the filter button
         */
        buttonClasses?: string,

        /**
         * Callback triggered when the filter form is submitted
         */
        onSetFilters: (e: Event) => void,

        /**
         * Slot content to be rendered inside the filter panel
         */
        children?: import('svelte').Snippet;
    }

    let {
        button = $bindable(),
        buttonClasses = "",
        onSetFilters = () => {},
        children
    } : Props = $props();

    function handleSubmit(e: Event) {
        e.preventDefault();
        onSetFilters(e);
    }
</script>

<div>
    <Button
        bind:buttonInstance={buttonInstance}
        type="button"
        variant="primary"
        size="small"
        icon={FunnelIcon}
        iconPosition="left"
        classes={buttonClasses}
    >
        Filtry
    </Button>

    <Dropdown targetElement={buttonInstance}>
        <form
            class="flex flex-col"
            onsubmit={handleSubmit}
        >
            <Button
                variant="primary"
                size="small"
                classes="m-1 mt-2 self-end"
                type="submit"
                title="Zastosuj
                filtry"
                icon={ListFilterPlusIcon}
                iconPosition="left"
            >Zastosuj filtry</Button>
            {@render children?.()}
        </form>
    </Dropdown>
</div>
