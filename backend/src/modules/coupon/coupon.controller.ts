import { NextFunction, Request, Response } from 'express';
import CustomError, { ERRORS } from '../../errors';
import { CouponService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { CreateValidationResult } from './coupon.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listAll(req: Request, res: Response, next: NextFunction) {
	try {
		const coupons = await new CouponService().listAll();

		return Respond({
			res,
			status: 200,
			data: {
				coupons,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function create(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateValidationResult;
	try {
		const coupon = await new CouponService().add(data);

		return Respond({
			res,
			status: 201,
			data: {
				coupon,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function update(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateValidationResult;
	const id = req.locals.id;
	try {
		await new CouponService().update(id, data);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function remove(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;
	await new CouponService().remove(id);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	listAll,
	create,
	update,
	remove,
};

export default Controller;
