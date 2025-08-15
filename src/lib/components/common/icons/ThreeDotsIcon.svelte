<script lang="ts">
    interface Props {
        [key: string]: any
    }

    let { ...rest }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...rest}>
    <circle cx="4" cy="12" r="3" fill="currentColor"></circle>
    <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
    <circle cx="20" cy="12" r="3" fill="currentColor"></circle>
</svg>
