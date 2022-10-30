import { z } from 'zod';

export const signUpSchema = z.object({
	body: z
		.object({
			name: z.string().min(3).max(50),
			lastName: z.string().min(3).max(50),
			password: z.string().min(5).max(16),
			passwordConfirmation: z.string().min(5).max(16),
			email: z.string().email(),
		})
		.refine(
			({ password, passwordConfirmation }) =>
				password && passwordConfirmation
					? password === passwordConfirmation
					: true,
			{
				message: 'The password and the password confirmation should match',
			},
		),
});

export const signInSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(5).max(16),
	}),
});
