import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type CreateValidationResult = {
	productCode: string;
	name: string;
	description: string;
	details: string;
	pricing_bifurcation: string;
	images: string[];
	videos: string[];
	tags: string[];
	size: string;
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string;
	price: number;
	discount: number;
	listed: boolean;
};

export async function CreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		productCode: z.string(),
		name: z.string(),
		description: z.string().default(''),
		details: z.string().default(''),
		pricing_bifurcation: z.string().default(''),
		images: z.string().array().default([]),
		videos: z.string().array().default([]),
		tags: z.string().array().default([]),
		size: z.string().or(z.null()).default(null),
		metal_color: z.enum(['Yellow', 'Rose Gold', 'White']),
		metal_type: z.enum(['Gold']),
		metal_quality: z.enum(['14K', '18K', '22K']),
		diamond_type: z.enum(['SI IJ', 'SI GH', 'VS GH', 'VVS EF']),
		price: z.number().nonnegative(),
		discount: z.number().nonnegative(),
		listed: z.boolean().default(false),
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
