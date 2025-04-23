<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Link from '$lib/components/common/Link.svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';

	let { data }: { data: PageData } = $props();

	let { form, enhance, errors, message } = superForm(data.form);
</script>

<main class="grid h-screen place-items-center">
	<h1>Zaloguj się</h1>

	<form method="post" use:enhance class="grid place-items-center">
		<label>
			Login
			<Input name="username" />
		</label>
		<label>
			Hasło
			<Input type="password" name="password" />
		</label>

		<div class="mt-4 flex flex-col gap-y-2">
			<Button type="submit" formaction="?/login">Zaloguj się</Button>
			<Button type="submit" formaction="?/register">Zarejestruj się</Button>
		</div>
	</form>

	<p style="color: red">{$message ?? ''}</p>
</main>

<!-- <div class="flex h-screen w-screen flex-col items-center justify-center gap-y-8"> -->
<!-- 	<Link href="/login">Zaloguj się</Link> -->
<!-- 	<Link href="/register">Zarejestruj się</Link> -->
<!-- </div> -->
