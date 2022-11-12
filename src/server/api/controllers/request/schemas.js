import { z } from 'zod';

const sharedNumberSchema = z
	.string()
	.min(1)
	.refine((num) => !isNaN(num), { message: 'Not a number' })
	.refine((num) => !isNaN(num) && parseInt(num) > 0, {
		message: 'Must be greater than 0',
	});

const requestParams = z.object({ service: sharedNumberSchema });

export const serviceQuerySchema = z.object({ params: requestParams });

const sharedRequestBody = {
	isFragile: z.string().regex(/(true|false)/, { message: 'Not a boolean' }),
	width: sharedNumberSchema,
	height: sharedNumberSchema,
	depth: sharedNumberSchema,
	weight: sharedNumberSchema,
	fromCity: z.string().min(3).max(50),
	fromAddress: z.string().min(3).max(100),
	toCity: z.string().min(3).max(50),
	toAddress: z.string().min(3).max(100),
	toOwner: z.string().min(3).max(50),
	toOwnerId: z
		.string()
		.min(3)
		.max(11)
		.refine((num) => !isNaN(num), { message: 'Not a number' })
		.refine((num) => !isNaN(num) && parseInt(num) > 99, {
			message: 'Minimum value is 100',
		}),
};

const requestBody = z.object({
	...sharedRequestBody,
	due: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
			message: 'Not a date',
		})
		.refine(
			(dueStr) => {
				const min = new Date(Date.now() + 24 * 60 * 60 * 1000); // plus 24h
				const due = new Date(dueStr);

				return due.getTime() >= min.getTime();
			},
			{ message: 'Too early!' },
		),
});

const updateBody = z.object({
	...sharedRequestBody,
	due: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
		message: 'Not a date',
	}),
});

export const newRequestSchema = z.object({ body: requestBody });

export const updateRequestSchema = z.object({
	params: requestParams,
	body: updateBody,
});
