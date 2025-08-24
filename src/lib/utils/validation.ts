import { z } from 'zod';

export function validate<T extends z.ZodType>(
	formData: FormData,
	schema: T
): { data?: z.infer<T>; errors?: any } {
	const formDataObj = Object.fromEntries(
		Array.from(formData.entries()).map(([key, value]) => {
			if (formData.getAll(key).length > 1) {
				return [key, formData.getAll(key)];
			}
			return [key, value];
		})
	);

	const result = schema.safeParse(formDataObj);

	if (!result.success) {
		// Simple object format - works perfectly!
		const errors: any = {};
		result.error.issues.forEach((issue) => {
			const path = issue.path.length > 0 ? issue.path.join('.') : '_form';
			errors[path] = issue.message;
		});

		return { errors };
	}

	return { data: result.data };
}
