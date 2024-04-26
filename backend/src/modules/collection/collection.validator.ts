import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { default as CustomError } from '../../errors';

export type CreateValidationResult = {
	id: string;
	name: string;
	image: string;
};

export type VisibilityValidationResult = {
	id: string;
	isVisible: boolean;
};

export async function CreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		id: z
			.string()
			.toLowerCase()
			.regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/),
		name: z.string(),
		image: z.string().default(''),
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

export async function UpdateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		id: z
			.string()
			.toLowerCase()
			.regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/),
		name: z.string(),
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

export async function VisibilityValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		isVisible: z.boolean(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.isVisible;
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

export async function CollectionIDValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/);
	const reqValidatorResult = reqValidator.safeParse(req.params.id);

	if (reqValidatorResult.success) {
		req.locals.collection_id = reqValidatorResult.data;
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

export async function TagsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		tags: z.string().array(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.tags;
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

export async function ProductsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		products: z.string().array(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.products;
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
