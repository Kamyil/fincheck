import { z } from 'zod';

// Parts validation schema for JSON parts data
const partsReplacedSchema = z
	.array(
		z.object({
			name: z
				.string()
				.min(1, 'Nazwa części jest wymagana')
				.max(100, 'Nazwa części może mieć maksymalnie 100 znaków'),
			cost: z.number().min(0, 'Koszt części musi być nieujemny').optional(),
			quantity: z.number().int().min(1, 'Ilość musi być liczbą całkowitą większą od 0').default(1)
		})
	)
	.optional();

// Base health record schema for shared fields
const baseHealthRecordSchema = z.object({
	title: z
		.string()
		.min(2, 'Tytuł musi mieć co najmniej 2 znaki')
		.max(200, 'Tytuł może mieć maksymalnie 200 znaków')
		.trim(),

	description: z
		.string()
		.max(1000, 'Opis może mieć maksymalnie 1000 znaków')
		.trim()
		.optional()
		.or(z.literal('')),

	mileage: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : undefined))
		.refine(
			(val) => val === undefined || (Number.isInteger(val) && val >= 0),
			'Przebieg musi być nieujemną liczbą całkowitą'
		),

	serviceDate: z
		.string()
		.min(1, 'Data serwisu jest wymagana')
		.refine((val) => !isNaN(Date.parse(val)), 'Nieprawidłowa data serwisu'),

	serviceType: z
		.string()
		.max(100, 'Typ serwisu może mieć maksymalnie 100 znaków')
		.trim()
		.optional()
		.or(z.literal('')),

	partsReplaced: z
		.string()
		.optional()
		.transform((val) => {
			if (!val || val.trim() === '') return undefined;
			try {
				const parsed = JSON.parse(val);
				return partsReplacedSchema.parse(parsed);
			} catch {
				throw new Error('Nieprawidłowy format danych części');
			}
		}),

	laborCost: z
		.string()
		.optional()
		.transform((val) => (val ? parseFloat(val) : undefined))
		.refine(
			(val) => val === undefined || (!isNaN(val) && val >= 0),
			'Koszt robocizny musi być nieujemną liczbą'
		),

	totalCost: z
		.string()
		.optional()
		.transform((val) => (val ? parseFloat(val) : undefined))
		.refine(
			(val) => val === undefined || (!isNaN(val) && val >= 0),
			'Całkowity koszt musi być nieujemną liczbą'
		),

	receiptUrl: z
		.string()
		.refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), 'Nieprawidłowy URL paragonu')
		.optional()
		.or(z.literal('')),

	serviceProvider: z
		.string()
		.max(200, 'Nazwa usługodawcy może mieć maksymalnie 200 znaków')
		.trim()
		.optional()
		.or(z.literal(''))
});

// Schema for adding new health record
export const addHealthRecordSchema = baseHealthRecordSchema.extend({
	vehicleId: z.string().min(1, 'ID pojazdu jest wymagane')
});

// Schema for updating existing health record
export const updateHealthRecordSchema = baseHealthRecordSchema.extend({
	id: z.string().min(1, 'ID rekordu jest wymagane')
});

// Schema for deleting health record
export const deleteHealthRecordSchema = z.object({
	recordId: z.string().min(1, 'ID rekordu jest wymagane')
});
