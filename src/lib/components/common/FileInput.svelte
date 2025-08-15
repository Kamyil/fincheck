<script lang="ts">

    interface Props {
        label?: string;
        accept: HTMLInputElement['accept'] | undefined;
        name: HTMLInputElement['name'] | undefined;
        file: File | null | undefined;
    }

    let {
        label = '',
        accept,
        name,
        file = $bindable()
    }: Props = $props();
    let files = $state(undefined as FileList | undefined);
</script>

<label class="mt-2 block text-sm font-medium text-zinc-500">
    {label}
    <input
            bind:files
            onchange={e => {
                file = (files ? files[0] : undefined)
            }}
            {name}
            {accept}
            type="file"
            class="block mt-1 w-full rounded-md file:py-4 file:border-0 text-gray-900 transition-all duration-150 md:text-md sm:text-sm border-1"
    />
</label>
