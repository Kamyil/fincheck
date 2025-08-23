<script module lang="ts">
	let isRawring = $state(false);
	let audio: HTMLAudioElement = $state()!;

	export function RAAAAWR() {
		isRawring = true;
		audio.play();
		setTimeout(() => {
			isRawring = false;
		}, 5 * 1000);
	}
</script>

<img id="rawr" src="$lib/images/raptor.png" alt="RAWR" class:animationOn={isRawring} />
<audio src="$lib/audio/rawr.mp3" bind:this={audio}></audio>

<style>
	#rawr {
		width: 400px;
		height: 600px;
		position: absolute;
		bottom: -600px;
		right: -400px;
		display: none;
		z-index: -1;
	}
	#rawr.animationOn {
		display: block;
		z-index: 999999;
		-webkit-animation:
			show 0.4s cubic-bezier(0.54, 0.72, 0.92, 1.78) 0s 1,
			strike 2.6s cubic-bezier(0.4, 0, 1, 1) 0.4s 1;
		animation:
			show 0.4s cubic-bezier(0.54, 0.72, 0.92, 1.78) 0s 1,
			strike 2.6s cubic-bezier(0.4, 0, 1, 1) 0.4s 1;
	}
	@-webkit-keyframes show {
		0% {
			bottom: -600px;
			right: 100px;
		}
		100% {
			bottom: -130px;
			right: 100px;
		}
	}
	@keyframes show {
		0% {
			bottom: -600px;
			right: 100px;
		}
		100% {
			bottom: -130px;
			right: 100px;
		}
	}
	@-webkit-keyframes strike {
		0%,
		13% {
			bottom: -130px;
			right: 100px;
		}
		100% {
			bottom: -130px;
			right: 100%;
		}
	}
	@keyframes strike {
		0%,
		13% {
			bottom: -130px;
			right: 100px;
		}
		100% {
			bottom: -130px;
			right: 100%;
		}
	}
</style>
