import { z } from 'zod';

export const addVehicleSchema = z.object({
	make: z
		.string()
		.min(2, 'Marka musi mieć co najmniej 2 znaki')
		.max(50, 'Marka nie może mieć więcej niż 50 znaków'),
	model: z
		.string()
		.min(2, 'Model musi mieć co najmniej 2 znaki')
		.max(50, 'Model nie może mieć więcej niż 50 znaków'),
	year: z.coerce
		.number()
		.int('Rok musi być liczbą całkowitą')
		.min(1900, 'Rok musi być większy niż 1900')
		.max(new Date().getFullYear(), 'Rok nie może być z przyszłości'),
	vin: z
		.string()
		.length(17, 'VIN musi mieć dokładnie 17 znaków')
		.regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN zawiera nieprawidłowe znaki')
		.nullish()
		.or(z.literal('')),
	registration: z
		.string()
		.min(2, 'Numer rejestracyjny musi mieć co najmniej 2 znaki')
		.max(20, 'Numer rejestracyjny nie może mieć więcej niż 20 znaków')
		.nullish()
		.or(z.literal('')),
	color: z
		.string()
		.min(2, 'Kolor musi mieć co najmniej 2 znaki')
		.max(30, 'Kolor nie może mieć więcej niż 30 znaków')
		.nullish()
		.or(z.literal('')),
	mileage: z.coerce
		.number()
		.int('Przebieg musi być liczbą całkowitą')
		.min(0, 'Przebieg nie może być ujemny')
		.max(9999999, 'Przebieg jest zbyt duży')
		.nullish()
});

export const updateVehicleSchema = z.object({
	id: z.string().min(1, 'ID pojazdu jest wymagane'),
	make: z
		.string()
		.min(2, 'Marka musi mieć co najmniej 2 znaki')
		.max(50, 'Marka nie może mieć więcej niż 50 znaków'),
	model: z
		.string()
		.min(2, 'Model musi mieć co najmniej 2 znaki')
		.max(50, 'Model nie może mieć więcej niż 50 znaków'),
	year: z.coerce
		.number()
		.int('Rok musi być liczbą całkowitą')
		.min(1900, 'Rok musi być większy niż 1900')
		.max(new Date().getFullYear(), 'Rok nie może być z przyszłości'),
	vin: z
		.string()
		.length(17, 'VIN musi mieć dokładnie 17 znaków')
		.regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN zawiera nieprawidłowe znaki')
		.nullish()
		.or(z.literal('')),
	registration: z
		.string()
		.min(2, 'Numer rejestracyjny musi mieć co najmniej 2 znaki')
		.max(20, 'Numer rejestracyjny nie może mieć więcej niż 20 znaków')
		.nullish()
		.or(z.literal('')),
	color: z
		.string()
		.min(2, 'Kolor musi mieć co najmniej 2 znaki')
		.max(30, 'Kolor nie może mieć więcej niż 30 znaków')
		.nullish()
		.or(z.literal('')),
	mileage: z.coerce
		.number()
		.int('Przebieg musi być liczbą całkowitą')
		.min(0, 'Przebieg nie może być ujemny')
		.max(9999999, 'Przebieg jest zbyt duży')
		.nullish()
});

export const deleteVehicleSchema = z.object({
	id: z.string().min(1, 'ID pojazdu jest wymagane')
});

export type AddVehicleInput = z.infer<typeof addVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type DeleteVehicleInput = z.infer<typeof deleteVehicleSchema>;
