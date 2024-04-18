import { NextFunction, Request, Response } from 'express';
import CustomError, { ERRORS } from '../../errors';
import { CartService } from '../../services';
import { Respond, idValidator } from '../../utils/ExpressUtils';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function cart(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;

	try {
		const cart = await new CartService(session).getCart();
		const total = cart.reduce((acc, item) => {
			return (acc += item.quantity * item.price);
		}, 0);

		return Respond({
			res,
			status: 200,
			data: {
				total,
				cart,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function addToCart(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const product_id = req.locals.id;
	const [product_option_valid, product_option] = idValidator(req.body.product_option);
	if (!product_option_valid) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		await new CartService(session).addToCart(product_id, product_option);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function decreaseQuantityFromCart(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const product_id = req.locals.id;
	try {
		await new CartService(session).removeQuantityFromCart(product_id);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function removeFromCart(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const product_id = req.locals.id;
	try {
		await new CartService(session).removeFromCart(product_id);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	addToCart,
	cart,
	removeFromCart,
	decreaseQuantityFromCart,
};

export default Controller;
