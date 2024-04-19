import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type CreateValidationResult = {
	name: string;
	couponCode: string;
	availableCoupon: number;
	discountAmount: number;
	discountPercentage: number;
	discountType: 'amount' | 'percentage';
};

export async function CreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string(),
		couponCode: z.string(),
		availableCoupon: z.number().nonnegative(),
		discountAmount: z.number().nonnegative(),
		discountPercentage: z.number().min(0).max(100),
		discountType: z.enum(['amount', 'percentage']),
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
