<script lang="ts">
	import { enhance } from '$app/forms';
	import Heading from '$lib/components/common/Heading.svelte';
	import Link from '$lib/components/common/Link.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<main>
	<h1>Zalogowany Hejo</h1>

	<span>Czesc, {data?.user.username}!</span>
	<p>Your user ID is {data?.user.id}.</p>

	<Link href="/logout">Wyloguj sie</Link>

	<Heading>Twoje auta</Heading>
</main>
