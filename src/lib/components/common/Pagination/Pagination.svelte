<script lang="ts">
    import { run } from "svelte/legacy";

    import { slide } from "svelte/transition";
    import { twMerge } from "tailwind-merge";
    import { matchNumberToBeWithinBounds } from "$lib/utils";
    import PaginationItem from "$lib/components/common/Pagination/PaginationItem.svelte";
    import Select from "$lib/components/common/Select.svelte";
    import { type Filters, type Filter, gotoFilters, type PaginationFiltersDefinition } from "$lib/utilities/filters";
    import { page } from "$app/stores";
    import _range from 'lodash-es/range';

    interface Props {
        /**
         * Standard prop for modifying component's look using Tailwind classes
         */
        classes?: string;
        total?: number;
        filters: Filters<Record<string, PaginationFiltersDefinition["page"] | PaginationFiltersDefinition["perPage"]>>;
        perPageFilterName?: string;
        pageFilterName?: string;
    }

    let { classes = "", total = 0, filters, perPageFilterName = "perPage", pageFilterName = "page" }: Props = $props();

    const pageFilter = $state(filters[pageFilterName] as Filter<PaginationFiltersDefinition["page"]>);
    const perPageFilter = $state(filters[perPageFilterName] as Filter<PaginationFiltersDefinition["perPage"]>);

    const MINIMUM_PER_PAGE_ITEMS_AMOUNT = perPageFilter.metadata.perPages[0];

    let lastPage = $derived(Math.ceil(total / perPageFilter.value));
    let pagesBeforeCurrent = $derived(Math.min(pageFilter.value - 1, 2));
    let pagesAfterCurrent = $derived(Math.min(lastPage - pageFilter.value, 2));

    let perPagesParsedToSelectOptions = $derived(
        perPageFilter.metadata.perPages.map((v) => {
            return { label: `${v}`, value: v };
        }),
    );

    // check if current page is within the bounds
    run(() => {
        if (pageFilter.value * perPageFilter.value > total + perPageFilter.value) {
            // and prevent user from going to page that is out of bounds
            // when user has already selected page and then selects the filter
            // that highly reduces the results
            pageFilter.value = pageFilter.default;
            gotoFilters($page.url, { ...filters, [perPageFilterName]: perPageFilter, [pageFilterName]: pageFilter });
        }
    });

    function setPage(newPage: number) {
        pageFilter.value = matchNumberToBeWithinBounds({ min: 1, newValue: newPage, max: lastPage });

        gotoFilters($page.url, { ...filters, [perPageFilterName]: perPageFilter, [pageFilterName]: pageFilter });
    }
</script>

{#if total && total > MINIMUM_PER_PAGE_ITEMS_AMOUNT}
    <Select
        bind:value={perPageFilter.value}
        options={perPagesParsedToSelectOptions}
        maxWidth="80px"
        height="49px"
        classes="mr-2"
        onChange={() => {
            // Guard rail against picking page that is out of possible values
            // when selecting higher perPage which reduces available pages
            setPage(1);
        }}
    />
    <div transition:slide class={twMerge("mr-5 flex flex-row", classes)}>
        {#if pagesBeforeCurrent !== 0}
            {#if pagesBeforeCurrent > 1}
                <PaginationItem size="medium" active={false} onClick={() => setPage(1)}>
                    {"<<"}
                </PaginationItem>
            {/if}

            <PaginationItem
                size="medium"
                active={false}
                onClick={() => {
                    setPage(pageFilter.value - 1);
                }}
            >
                {"<"}
            </PaginationItem>
        {/if}

        {#each _range(pageFilter.value - pagesBeforeCurrent, 1 + pageFilter.value + pagesAfterCurrent) as pageNumber}
            <PaginationItem size="medium" active={pageNumber === pageFilter.value} onClick={() => setPage(pageNumber)}>
                {pageNumber}
            </PaginationItem>
        {/each}

        {#if pagesAfterCurrent !== 0}
            <PaginationItem
                size="medium"
                active={false}
                onClick={() => {
                    setPage(pageFilter.value + 1);
                }}
            >
                {">"}
            </PaginationItem>

            {#if pagesAfterCurrent > 1}
                <PaginationItem size="medium" active={false} onClick={() => setPage(lastPage)}>
                    {">>"}
                </PaginationItem>
            {/if}
        {/if}
    </div>
{/if}
