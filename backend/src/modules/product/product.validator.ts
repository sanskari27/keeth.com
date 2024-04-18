import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type CreateValidationResult = {
	name: string;
	discount: number;
	description: string;
	images: string[];
	videos: string[];
	price: number;
};

export type CreateProductOptionValidationResult = {
	productCode: string;
	description: string;
	images: string[];
	videos: string[];
	price: number;
	discount: number;
	metal_color: 'Yellow' | 'Rose Gold' | 'White';
	metal_type: 'Gold';
	metal_quality: '14K' | '18K' | '22K';
	diamond_type: 'SI IJ' | 'SI GH' | 'VS GH' | 'VVS EF';
};
export async function CreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string(),
		description: z.string().default(''),
		images: z.string().array().default([]),
		videos: z.string().array().default([]),
		price: z.number().nonnegative(),
		discount: z.number().nonnegative(),
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

export async function CreateProductOptionValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reqValidator = z.object({
		productCode: z.string(),
		description: z.string().default(''),
		images: z.string().array().default([]),
		videos: z.string().array().default([]),
		price: z.number().nonnegative(),
		discount: z.number().nonnegative(),
		metal_color: z.enum(['Yellow', 'Rose Gold', 'White']),
		metal_type: z.enum(['Gold']),
		metal_quality: z.enum(['14K', '18K', '22K']),
		diamond_type: z.enum(['SI IJ', 'SI GH', 'VS GH', 'VVS EF']),
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
