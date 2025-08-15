<script lang="ts">
    import Input from "$lib/components/common/Input.svelte";
    import Button from "$lib/components/common/Button.svelte";
    import SearchIcon from "lucide-svelte/icons/search";
    import {twMerge} from "tailwind-merge";

    interface Props {
        /**
         * Current search input value - can be bound with bind:value
         */
        value: string | null,

        /**
         * Placeholder text displayed in the search input when empty
         */
        placeholder?: string,

        /**
         * Additional css classes for the search form container
         */
        classes?: string,

        /**
         * Additional css classes for the search input field
         */
        inputClasses?: string,

        /**
         * Additional css classes for the search button
         */
        buttonClasses?: string,

        /**
         * Callback triggered when search form is submitted
         */
        onSearch: (e: Event) => void
    }

    let {
        value = $bindable(),
        placeholder = "",
        classes = "",
        inputClasses = "",
        buttonClasses = "",
        onSearch = () => {}
    } : Props = $props();

    function handleSubmit(e: Event) {
        e.preventDefault();
        onSearch(e);
    }
</script>

<form class={twMerge("flex flex-row justify-center", classes)} onsubmit={handleSubmit}>
    <Input
        bind:value={value}
        id="search"
        name="search"
        classes={inputClasses}
        {placeholder}
        type="search"
    />
    <Button
        variant="green_outline"
        size="small_square"
        classes={buttonClasses}
        type="submit"
        title="Szukaj"
        icon={SearchIcon}
        iconPosition="center"
    />
</form>
