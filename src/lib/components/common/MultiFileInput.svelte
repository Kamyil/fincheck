<script lang="ts">
    import { run } from 'svelte/legacy';

    import Button from "$lib/components/common/Button.svelte";
    import { slide } from "svelte/transition";
    import TrashIcon from "$lib/components/common/icons/TrashIcon.svelte";
    import ReturnIcon from "$lib/components/common/icons/ReturnIcon.svelte";
    import InputErrorMessage from "$lib/components/common/InputErrorMessage.svelte";



    

    

    

    
    interface Props {
        accept?: HTMLInputElement["accept"] | undefined;
        nameSuffix?: HTMLInputElement["name"] | undefined;
        triggerButtonOptions?: {
        variant: InstanceType<typeof Button>["$$prop_def"]["variant"];
        size: InstanceType<typeof Button>["$$prop_def"]["size"];
        content: string;
    };
        classes?: string;
        /** List of files initially on server */
        serverFiles?: { id: string, name: string, path: string }[];
        /** List of new files to upload */
        newFiles?: File[];
        /** List of file ID's to delete */
        deletedFiles?: typeof serverFiles[any]["id"][];
        // Errors are handled by superForms and ZOD. It would be nice to move the validation calling logic here in the future
        errors: Record<number, string[] & {_errors?: string[]}> & {_errors?: string[]} | undefined;
    }

    let {
        accept = undefined,
        nameSuffix = undefined,
        triggerButtonOptions = {
        variant: "neutral",
        size: "medium",
        content: "Dołącz załączniki",
    },
        classes = "",
        serverFiles = [],
        newFiles = $bindable([]),
        deletedFiles = $bindable([]),
        errors
    }: Props = $props();

    // Errors only apply to new files
    let newFilesErrorMap: Map<number, string[]> = $state(new Map());

    function updateErrorsMap(){
        newFilesErrorMap = new Map();

        if(errors === undefined) return;

        // Needed to silence TS errors
        const currentErrors = errors;

        let newFilesIdx = 0;

        // Iterate over all files, but check indexes by only new files
        // It's hacky and could be simplified if we moved the validation inside of this component
        files.forEach((f, idx) => {
            if('file' in f){
                if(newFilesIdx in currentErrors && currentErrors[newFilesIdx]){
                    const errorValue = currentErrors[newFilesIdx];

                    // Map all files idx to newFiles error
                    newFilesErrorMap.set(idx, '_errors' in errorValue ? errorValue._errors ?? [] : errorValue);
                }

                newFilesIdx++;
            }
        });
    }


    let inputRef: HTMLInputElement = $state();
    let filesDivRef: HTMLDivElement | undefined = $state();


    interface ServerFile {
        name: string;
        id: string;
        path: string;
        isDeleted: boolean;
    }

    interface BrowserFile {
        name: string;
        file: File;
        ref: HTMLInputElement | undefined; // Ref is only needed if nameSuffix was provided
    }

    type FilesList = (ServerFile | BrowserFile)[];

    // Internal list of files
    let files: FilesList = $state(serverFiles.map(f => ({...f, isDeleted: false})));


    function addFiles(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files) {
            files = [
                ...files,
                ...Array.from(input.files).map((file) => {
                    let ref;

                    if(filesDivRef && nameSuffix){
                        // The only way to transfer files between input elements
                        const dt = new DataTransfer();
                        dt.items.add(file);

                        ref = document.createElement('input');
                        ref.type = 'file';
                        ref.name = `new_${nameSuffix}`;
                        ref.files = dt.files;
                        ref.classList.add('hidden');

                        filesDivRef.appendChild(ref);
                    }

                    return {
                        name: file.name,
                        file: file,
                        ref: ref
                    };
                })
            ];

            // Reset the addFiles input
            input.value = '';
        }
    }
    run(() => {
        errors && updateErrorsMap();
    });
    run(() => {
        if(files) {
            newFiles = files
                .filter((item): item is BrowserFile => 'file' in item)
                .map(({file}) => file);

            deletedFiles = files
                .filter((item): item is ServerFile => ('isDeleted' in item && item.isDeleted === true))
                .map(({id}) => id);
        }
    });
</script>

<div class={classes}>
    <Button variant={triggerButtonOptions.variant} onClick={() => inputRef?.click()}>
        {triggerButtonOptions.content}
    </Button>

    <!-- Displaying the list of uploaded file names -->
    <ul transition:slide class="w-full">
        {#each files as file, idx}
            {@const error = newFilesErrorMap.get(idx)}

            <li transition:slide class="border-1 bg-white w-full shadow-md rounded-md p-2 my-2 flex items-center justify-center relative">
                <span class="text-stone-700 text-sm w-11/12">
                    {#if 'path' in file && 'isDeleted' in file}
                        <a href={`/api/storage/${file.path}`}
                           download={file.name}
                           class="underline"
                           class:line-through={file.isDeleted}
                        >
                            {file.name}
                        </a>
                    {:else}
                        {file.name}
                    {/if}

                    {#each error ?? [] as message}
                        <br />
                        <span class="text-red-500 text-xs">{message}</span>
                    {/each}
                </span>

                {#if 'isDeleted' in file}
                    {#if file.isDeleted}
                        <button type="button" class="text-red-600 hover:fill-red-800 mr-2 absolute right-1 flex justify-center items-center"
                                onclick={() => {file.isDeleted = false}}
                                title="Przywróć"
                        >
                            <ReturnIcon />
                        </button>
                    {:else}
                        <button type="button" class="mr-2 absolute right-1 flex justify-center items-center"
                            onclick={() => {file.isDeleted = true}}
                            title="Usuń"
                        >
                            <TrashIcon />
                        </button>
                    {/if}
                {:else}
                    <button type="button" class="mr-2 absolute right-1 flex justify-center items-center"
                        onclick={() => {
                            file.ref?.remove();
                            files = files.toSpliced(idx, 1);
                        }}
                        title="Usuń"
                    >
                        <TrashIcon />
                    </button>
                {/if}
            </li>
        {/each}
    </ul>


    <InputErrorMessage visibleWhen={errors?._errors !== undefined}>
        {#each (errors?._errors ?? []) as error}
            {error} <br />
        {/each}
    </InputErrorMessage>
</div>

<!-- An input multiple to reference -->
<input type="file" {accept} multiple bind:this={inputRef} class="hidden" onchange={addFiles} />

<!-- A list of file inputs for submitting in form -->
{#if nameSuffix}
    <!-- because svelte bind:files is readonly, we manually create the fields -->
    <div bind:this={filesDivRef} class="hidden"></div>

    {#each deletedFiles as id}
        <input type="hidden" value={id} name={`delete_${nameSuffix}`} />
    {/each}
{/if}
