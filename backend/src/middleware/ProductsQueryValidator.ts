import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import CustomError from '../errors';

export type ProductsQueryValidatorResult = {
	skip: number;
	limit: number;
	tags: string[];
	sort: 'discount' | 'new' | 'popular' | 'low-high' | 'high-low';
	price_min: number;
	price_max: number;
	collection_ids: string[];
	metals: string[];
	purity: ('14K' | '18K' | '22K')[];
	distinctProducts: boolean;
};

export default async function ProductsQueryValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reqValidator = z.object({
		skip: z
			.string()
			.optional()
			.refine((value) => {
				if (value === undefined) return true;
				const numberValue = parseFloat(value);
				return !(isNaN(numberValue) || numberValue < 0);
			})
			.transform((value) => {
				if (value === undefined) return 0;
				return parseFloat(value);
			}),

		limit: z
			.string()
			.optional()
			.refine((value) => {
				if (value === undefined) return true;
				const numberValue = parseFloat(value);
				return !(isNaN(numberValue) || numberValue < 0);
			})
			.transform((value) => {
				if (value === undefined) return 1000;
				return parseFloat(value);
			}),

		price_min: z
			.string()
			.optional()
			.refine((value) => {
				if (value === undefined) return true;
				const numberValue = parseFloat(value);
				return !(isNaN(numberValue) || numberValue < 0);
			})
			.transform((value) => {
				if (value === undefined) return 0;
				return parseFloat(value);
			}),

		price_max: z
			.string()
			.optional()
			.refine((value) => {
				if (value === undefined) return true;
				const numberValue = parseFloat(value);
				return !(isNaN(numberValue) || numberValue < 0);
			})
			.transform((value) => {
				if (value === undefined) return Number.MAX_VALUE;
				return parseFloat(value);
			}),

		collection_ids: z
			.string()
			.default('')
			.refine((value) => {
				if (!value) {
					return true;
				}
				const elements = value.split(',');
				const valid = elements.every((e) => e.match(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/));
				return valid;
			})
			.transform((value) => (!value ? [] : value.split(','))),

		tags: z
			.string()
			.default('')
			.transform((value) => (!value ? [] : value.split(','))),

		metals: z
			.string()
			.default('')
			.transform((value) => (!value ? [] : value.split(','))),

		purity: z
			.string()
			.default('')
			.transform((value) => (!value ? [] : value.split(','))),

		distinctProducts: z
			.string()
			.default('false')
			.transform((value) => value === 'true'),

		sort: z.enum(['new', 'popular', 'low-high', 'high-low', 'discount']).default('popular'),
	});

	const reqValidatorResult = reqValidator.safeParse(req.query);

	if (reqValidatorResult.success) {
		req.locals.query = reqValidatorResult.data as ProductsQueryValidatorResult;
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
