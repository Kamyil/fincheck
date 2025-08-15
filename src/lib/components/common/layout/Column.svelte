<!-- @component Column
**Requires wrapping with <Grid> component!**
2nd part of handy abstraction over CSS Grid.
Allows to create columns with the same familiar 12-column system as Bootstrap, which covers most of the layouts

- For specifying the column size that will be applied on all screen sizes, use the `size` prop
- For specifying different column sizes on different screen sizes, use `sm` / `md` / `lg` / `xl` / `xxl` props
```
NOTE!: Using both `size` and `sm`, `md`... props will not work as expected, since they're conflicting each other.
In such case `size` prop will be favored
```
- For more nuanced/advanced grid layouts however I rather recommend manually applying grid & col-span HTML classes
-->
<script lang="ts" module>
    export type ColumnSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | null;

    const spanClasses = {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
    } as const;


    export function getColumnSizeBasedOnSplitsAmount(splitsAmount: number): ColumnSize {
        if (splitsAmount === 1) return '12';
        if (splitsAmount === 2) return '6';
        if (splitsAmount === 3) return '4';
        if (splitsAmount === 4) return '3';
        if (splitsAmount === 5) return '2';

        return '12';
    }
</script>

<script lang="ts">
    import { run } from 'svelte/legacy';

    import { twMerge } from "tailwind-merge";

    interface Props {
        size?: ColumnSize;
        xs?: ColumnSize;
        sm?: ColumnSize;
        md?: ColumnSize;
        lg?: ColumnSize;
        xl?: ColumnSize;
        xxl?: ColumnSize;
        classes?: string;
        id?: string;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        size = "12",
        xs = null,
        sm = null,
        md = null,
        lg = null,
        xl = null,
        xxl = null,
        classes = "",
        id = "",
        children,
        ...rest
    }: Props = $props();

    let sizingClasses = $state(size ? spanClasses[size] : "");

    run(() => {
        xs && (sizingClasses += ` xs:${spanClasses[xs]}`);
    });
    run(() => {
        sm && (sizingClasses += ` sm:${spanClasses[sm]}`);
    });
    run(() => {
        md && (sizingClasses += ` md:${spanClasses[md]}`);
    });
    run(() => {
        lg && (sizingClasses += ` lg:${spanClasses[lg]}`);
    });
    run(() => {
        xl && (sizingClasses += ` xl:${spanClasses[xl]}`);
    });
    run(() => {
        xxl && (sizingClasses += ` 2xl:${spanClasses[xxl]}`);
    });
</script>

<div {id} class={twMerge(sizingClasses, classes)} {...rest}>
    {@render children?.()}
</div>
