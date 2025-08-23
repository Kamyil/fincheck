<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		href: string | undefined;
		classes?: string;
		target: HTMLAnchorElement['target'];
		children?: import('svelte').Snippet;
		variant?: keyof typeof variants;
	}

	let variants = {
		primary: 'text-primary hover:text-primary_darker',
		neutral: ''
	} as const;

	let { href, classes = '', target, children, variant = 'primary' }: Props = $props();
</script>

<a
	class={twMerge('text-primary_darker block underline', variants[variant], classes)}
	{href}
	{target}
>
	{@render children?.()}
</a>
