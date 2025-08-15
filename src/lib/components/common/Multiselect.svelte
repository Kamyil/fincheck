<script lang="ts">
    import { run } from "svelte/legacy";
    import MultiSelect, { type Option } from "svelte-multiselect";
    import _debounce from "lodash-es/debounce";

    type SelectOption = { label: string; value: string | number };

    type LoadFunction = (searchText: string) => Promise<SelectOption[]>;

    interface Props {
        name?: string | undefined;
        selected?: Array<string | number>;
        options?: SelectOption[];
        loadOptions?: LoadFunction | undefined;
        type?: "string" | "number";
        [key: string]: any;
    }

    let { name = undefined, selected = $bindable([]), options = $bindable([]), loadOptions = undefined, type = "string", ...rest }: Props = $props();

    /* 2-way binding for values, to make it behave like normal multiple select */
    let multiSelectValue: SelectOption[] = $state([]);

    const setMultiSelectValue = () => {
        multiSelectValue = allOptions?.filter((v) => selected.includes(castType(v.value))) ?? [];
    };

    const handleChange = () => {
        // We only change the value of selected. multiSelectValue is derived from it
        selected = multiSelectValue.map((v) => castType(v.value)) ?? [];
    };

    const castType = (v: string | number) => {
        if (type === "number") {
            return Number(v);
        }

        return v;
    };

    /**
     * We key by "value" to allow duplicate labels
     *
     * Couldn't be done without warnings inline in component
     * This is a workaround for the lack of generic support in the library
     */
    const key = (opt: Option) => (opt as SelectOption).value;

    /* Dynamic options loading */
    let loading = $state(false);
    let searchText = $state("");
    let allOptions = $state([]);

    const handleLoad = _debounce(async () => {
        if (!loadOptions) return;

        loading = true;
        options = await loadOptions(searchText);
        loading = false;
    }, 500);

    $effect.pre(() => {
        allOptions = options;
        // allOptions = _.uniqBy([...multiSelectValue, ...options], (option) => castType(option.value));
    });
    $effect.pre(() => {
        // Update the value of multiSelectValue on selected change -> either from inside or outside
        if (selected) {
            setMultiSelectValue();
        }

        // Handle the bug where cleared items did not affect selected items
        // (there were still selected items despite clearing all items)
        if (!selected) {
            selected = [];
            setMultiSelectValue();
        }
    });
    $effect.pre(() => {
        if (loadOptions && searchText) {
            handleLoad();
        }
    });
</script>

<MultiSelect
    bind:options={allOptions}
    bind:selected={multiSelectValue}
    bind:searchText
    --sms-min-height="54px"
    --sms-border-radius="0.375rem"
    liSelectedClass="text-balance"
    removeAllTitle="Usuń wszystkie"
    removeBtnTitle="Usuń"
    noMatchingOptionsMsg="Brak wyników"
    ondrop={() => {}}
    on:add={handleChange}
    on:remove={handleChange}
    on:removeAll={(e) => {
        multiSelectValue = [];
        handleChange();
    }}
    {key}
    {loading}
    {...rest}
/>

{#if name}
    {#each selected as value}
        <input type="hidden" {name} {value} />
    {/each}
{/if}

<style>
    :global(div.multiselect > ul.selected > li) {
        white-space: normal !important;
    }
</style>
