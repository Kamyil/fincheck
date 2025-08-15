<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        classes?: string;
    }

    let { classes = "" }: Props = $props();
</script>

<img alt="ST" class={twMerge("h-12", classes)} src="$lib/images/St-logo.png">
