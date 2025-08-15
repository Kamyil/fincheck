import { query, form } from '$app/server';
import { error } from '@sveltejs/kit';

// Define the Todo type for better type safety
type Todo = {
	id: string;
	text: string;
	completed: boolean;
};

// In a real app, this would be stored in a database
let todos: Todo[] = [
	{ id: '1', text: 'Learn Svelte 5', completed: true },
	{ id: '2', text: 'Implement remote functions', completed: false },
	{ id: '3', text: 'Use async Svelte', completed: false }
];

// Generate a simple UUID for new todos
function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

// Get all todos
export const getTodos = query(async () => {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500));
	return [...todos];
});

// Add a new todo
export const addTodo = form(async (data) => {
	const text = data.get('text');

	if (typeof text !== 'string' || !text.trim()) {
		return { success: false, error: 'Todo text cannot be empty' };
	}

	const newTodo: Todo = {
		id: generateId(),
		text: text.trim(),
		completed: false
	};

	todos = [...todos, newTodo];

	// Refresh getTodos query to update the UI
	await getTodos().refresh();

	return { success: true };
});

// Toggle todo completion status
export const toggleTodo = form(async (data) => {
	const id = data.get('id');

	if (typeof id !== 'string') {
		error(400, 'Invalid ID');
	}

	const todo = todos.find((t) => t.id === id);

	if (!todo) {
		error(404, `Todo with id ${id} not found`);
	}

	todo.completed = !todo.completed;
	todos = todos.map((t) => (t.id === id ? todo : t));

	// Refresh getTodos query to update the UI
	await getTodos().refresh();

	return { success: true, completed: todo.completed };
});

// Delete todo
export const removeTodo = form(async (data) => {
	const id = data.get('id');

	if (typeof id !== 'string') {
		error(400, 'Invalid ID');
	}

	const todoExists = todos.some((t) => t.id === id);

	if (!todoExists) {
		error(404, `Todo with id ${id} not found`);
	}

	todos = todos.filter((t) => t.id !== id);

	// Refresh getTodos query to update the UI
	await getTodos().refresh();

	return { success: true };
});
