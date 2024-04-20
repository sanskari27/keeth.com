import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type CreateValidationResult = {
	name: string;
	productCodes: string[];
};

export type ProductCodesValidationResult = {
	productCodes: string[];
};

export async function CreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string(),
		productCodes: z.string().array().default([]),
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

export async function ProductCodeValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		productCodes: z.string().array(),
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
