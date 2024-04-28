import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type CreateValidationResult = {
	productCode: string;
	name: string;
	description: string;
	details: string;
	pricing_bifurcation: string;
	images: string[] | undefined;
	videos: string[] | undefined;
	tags: string[];
	size: string;
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string | null;
	price: number;
	discount: number;
};

export type NewArrivalValidationResult = {
	productCode: string;
	status: boolean;
};

export async function CreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		productCode: z.string(),
		name: z.string(),
		description: z.string().default(''),
		details: z.string().default(''),
		pricing_bifurcation: z.string().default(''),
		images: z.string().array().or(z.undefined()),
		videos: z.string().array().or(z.undefined()),
		tags: z.string().array().default([]),
		size: z.string().or(z.null()).default(null),
		metal_color: z.enum(['Yellow', 'Rose Gold', 'White']),
		metal_type: z.enum(['Gold']),
		metal_quality: z.enum(['14K', '18K', '22K']),
		diamond_type: z.enum(['SI IJ', 'SI GH', 'VS GH', 'VVS EF']).or(z.null()),
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

export async function NewArrivalValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		productCode: z.string(),
		status: z.boolean(),
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
