<!--
    @component Notification

    Standardized component for displaying messages for the user
    However, this component should be used in a different way than others
    because you shouldn't use this component directly, but rather use it's `notify()` function
    When function called, Notification will appear automatically by itself (unless it's not mounted into root layout)
    If notification does not show up, make sure nothing overlaps it and it's mounted to the root layout
-->
<script lang="ts" module>
	let TypeToColorMap = {
		normal: 'border-transparent',
		danger: 'border-red-500 bg-red-500 text-white',
		success: 'border-green-400 bg-green-500 text-white',
		info: 'border-blue-500 text-white bg-blue-500'
	} as const;

	export type NotificationProps = {
		title: string;
		description?: string;
		type: keyof typeof TypeToColorMap;
	};

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<NotificationProps>();
	export const addToast = helpers.addToast;

	/**
	 * Triggers notification box to show up with provided message
	 */
	export function notify(messageOrOptions: string | NotificationProps) {
		if (typeof messageOrOptions === 'string') {
			addToast({
				data: { title: messageOrOptions, description: '', type: 'normal' }
			});
		} else {
			addToast({
				data: {
					title: messageOrOptions.title,
					description: messageOrOptions.description ?? '',
					type: messageOrOptions.type ?? 'normal'
				}
			});
		}
	}
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte';
	import X from 'lucide-svelte/icons/x';
	import { cubicInOut, expoInOut, quartInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		/** Standard prop for modyfing component's look using Tailwind classes */
		classes?: string;
	}

	let { classes = '' }: Props = $props();
</script>

<div use:portal id="notifications-slide-track" class="fixed right-10 bottom-10 z-[99]">
	{#each $toasts as { id, data } (id)}
		<div
			transition:fly={{ y: 50, duration: 300, easing: quartInOut }}
			use:melt={$content(id)}
			class={twMerge(
				'relative z-[99] my-5 rounded-md border bg-white p-5 opacity-90 shadow-2xl backdrop-blur-xl',
				classes,
				TypeToColorMap[data.type]
			)}
		>
			<div>
				<div class="p-2">
					<h3 use:melt={$title(id)} class="text-md font-bold">
						{data.title}
					</h3>
					<div use:melt={$description(id)} class="text-xs font-medium">
						{data.description}
					</div>
				</div>
				<button
					use:melt={$close(id)}
					aria-label="close notification"
					class="absolute top-2 right-2 z-50 cursor-pointer"
					class:text-black={data.type === 'normal'}
				>
					<X size={14} />
				</button>
			</div>
		</div>
	{/each}
</div>
