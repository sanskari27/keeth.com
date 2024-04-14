import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import CustomError from '../errors';

export async function IDValidator(req: Request, res: Response, next: NextFunction) {
	const validator = z.string();
	const validationResult = validator.safeParse(req.params.id);
	if (validationResult.success) {
		req.locals.id = validationResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: 'Invalid ID',
		})
	);
}
