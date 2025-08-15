<script lang="ts">
	import { getTodos, addTodo, toggleTodo, removeTodo } from '$lib/todos/data.remote';
</script>

<svelte:boundary>
	<div class="container mx-auto max-w-2xl p-8">
		<h1 class="mb-6 text-3xl font-bold">Todo List with Remote Functions</h1>

		<!-- Add Todo Form -->
		<form {...addTodo} class="mb-8">
			<div class="flex gap-2">
				<input
					name="text"
					class="flex-1 rounded border px-4 py-2"
					placeholder="Add a new task..."
					autocomplete="off"
				/>
				<button type="submit" class="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
					Add
				</button>
			</div>

			{#if addTodo.result?.error}
				<p class="mt-2 text-sm text-red-600">{addTodo.result.error}</p>
			{/if}
		</form>

		<!-- Todo List -->
		<div class="rounded-lg bg-white p-4 shadow">
			<h2 class="mb-4 text-xl font-semibold">Tasks</h2>

			{#key getTodos().current}
				{@const todos = await getTodos()}

				{#if todos.length === 0}
					<p class="text-gray-500 italic">No tasks yet. Add one above!</p>
				{:else}
					<ul class="divide-y">
						{#each todos as todo}
							<li class="flex items-center justify-between py-3">
								<div class="flex items-center">
									<form {...toggleTodo} class="mr-3">
										<input type="hidden" name="id" value={todo.id} />
										<input
											type="checkbox"
											checked={todo.completed}
											class="h-5 w-5 cursor-pointer accent-blue-600"
										/>
									</form>

									<span class={todo.completed ? 'text-gray-500 line-through' : ''}>
										{todo.text}
									</span>
								</div>

								<form {...removeTodo}>
									<input type="hidden" name="id" value={todo.id} />
									<button
										type="submit"
										class="text-red-600 hover:text-red-800"
										aria-label="Delete todo"
									>
										Delete
									</button>
								</form>
							</li>
						{/each}
					</ul>
				{/if}
			{/key}
		</div>
	</div>

	{#snippet pending()}
		<div class="container mx-auto flex items-center justify-center p-8">
			<div class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
		</div>
	{/snippet}
</svelte:boundary>
