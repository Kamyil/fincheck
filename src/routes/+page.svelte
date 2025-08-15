<div class="container mx-auto p-8">
	<h1 class="mb-6 text-3xl font-bold">Welcome to Pan-Samochodzik</h1>

	<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		<a href="/profile" class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
			<h2 class="mb-2 text-xl font-semibold">User Profile</h2>
			<p class="text-gray-600">Example of remote functions for form handling</p>
		</a>

		<a href="/todos" class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
			<h2 class="mb-2 text-xl font-semibold">Todo List</h2>
			<p class="text-gray-600">Example of async Svelte with remote functions</p>
		</a>
	</div>

	<div class="mt-12 rounded-lg border border-blue-100 bg-blue-50 p-6">
		<h2 class="mb-2 text-xl font-semibold">About this Project</h2>
		<p>
			This project demonstrates SvelteKit's experimental remote functions and Svelte's async
			features.
		</p>
		<ul class="mt-4 ml-6 list-disc space-y-2">
			<li>Type-safe server-client communication</li>
			<li>Form handling without custom endpoints</li>
			<li>Await expressions directly in markup</li>
			<li>Single-flight mutations</li>
		</ul>
	</div>
</div>
