import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type BillingDetailsValidationResult = {
	email: string;
	phone: string;
	name: string;
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
};

export async function BillingDetailsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		email: z.string().email(),
		phone: z.string(),
		name: z.string(),
		address_line_1: z.string(),
		address_line_2: z.string().default(''),
		address_line_3: z.string().default(''),
		street: z.string(),
		city: z.string(),
		state: z.string(),
		country: z.string(),
		postal_code: z.string(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}
	const message = reqValidatorResult.error.issues
		.map((err) => err.path)
		.flat()
		.filter((item, pos, arr) => arr.indexOf(item) == pos)
		.join(', ');

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: message,
		})
	);
}
