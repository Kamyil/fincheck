<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
	}

	let { classes = '' }: Props = $props();
</script>

<svg
	class={twMerge('', classes)}
	xmlns="http://www.w3.org/2000/svg"
	width="1em"
	height="1em"
	viewBox="0 0 24 24"
	><g fill="none" stroke="currentColor"
		><circle cx="12" cy="12" r="9" /><path
			stroke-linecap="round"
			d="M12 12h9m-9-9v8.938c0 .04.016.078.044.106L18 18"
		/></g
	></svg
>
