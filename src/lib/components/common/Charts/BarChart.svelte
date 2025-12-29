<!-- Svelte 5 broke svelte-charts library and there is still no updated version supporting Svelte 5 -->
<!-- based on: https://github.com/SauravKanchan/svelte-chartjs/issues/158#issuecomment-2456212827 -->
<!-- ^ comment, it's now actually easier to abstract charts by ourselves rather than depending on another wrapper library -->
<!-- so this componenet is doing exactly that :) -->
<script lang="ts">
	import {
		Chart,
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend,
		type ChartData,
		type ChartOptions
	} from 'chart.js';
	import type { HTMLCanvasAttributes } from 'svelte/elements';

	interface Props extends HTMLCanvasAttributes {
		data: ChartData<'bar', number[], string>;
		options: ChartOptions<'bar'>;
	}

	const { data, options, ...rest }: Props = $props();

	Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

	let canvasElem: HTMLCanvasElement;
	let chart: Chart;

	$effect(() => {
		chart = new Chart(canvasElem, {
			type: 'bar',
			data,
			options
		});

		return () => {
			chart.destroy();
		};
	});

	$effect(() => {
		if (chart) {
			chart.data = data;
			chart.update();
		}
	});
</script>

<canvas bind:this={canvasElem} {...rest}></canvas>
