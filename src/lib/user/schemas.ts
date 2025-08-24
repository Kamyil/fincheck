import { z } from 'zod';

export const updateUserProfileSchema = z.object({
	username: z
		.string()
		.min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki')
		.max(50, 'Nazwa użytkownika może mieć maksymalnie 50 znaków')
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			'Nazwa użytkownika może zawierać tylko litery, cyfry, myślniki i podkreślenia'
		)
		.trim(),

	email: z
		.string()
		.min(1, 'Adres e-mail jest wymagany')
		.refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Nieprawidłowy adres e-mail')
		.max(255, 'Adres e-mail może mieć maksymalnie 255 znaków')
		.trim()
		.toLowerCase()
});
