import { NextFunction, Request, Response } from 'express';
import CustomError, { ERRORS } from '../../errors';
import { WishlistService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listAll(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;

	try {
		const wishlist = await new WishlistService(session).getWishlist();

		return Respond({
			res,
			status: 200,
			data: {
				wishlist,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function isInList(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const product_id = req.locals.id;

	try {
		const contains = await new WishlistService(session).contains(product_id);

		return Respond({
			res,
			status: 200,
			data: {
				contains,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function addToList(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const product_id = req.locals.id;

	try {
		await new WishlistService(session).addToList(product_id);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function removeFromList(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const product_id = req.locals.id;
	try {
		await new WishlistService(session).removeFromList(product_id);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	isInList,
	addToList,
	listAll,
	removeFromList,
};

export default Controller;
