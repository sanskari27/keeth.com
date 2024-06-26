import { NextFunction, Request, Response } from 'express';
import { IS_PRODUCTION, TRANSACTION_COOKIE } from '../../config/const';
import CustomError, { ERRORS } from '../../errors';
import { CartService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function cart(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;

	try {
		const cart = await new CartService(session).getCart();
		const { total, discount, gross, quantity } = cart.reduce(
			(acc, item) => {
				acc.total += item.quantity * (item.price - item.discount);
				acc.discount += item.quantity * item.discount;
				acc.gross += item.quantity * item.price;
				acc.quantity += item.quantity;
				return acc;
			},
			{ total: 0, gross: 0, discount: 0, quantity: 0 }
		);

		return Respond({
			res,
			status: 200,
			data: {
				summary: {
					total,
					discount,
					gross,
					quantity,
				},
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
	res.clearCookie(TRANSACTION_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});

	try {
		await new CartService(session).addToCart(product_id);
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
	res.clearCookie(TRANSACTION_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});
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
	res.clearCookie(TRANSACTION_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});
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

async function abandonedCarts(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			carts: await CartService.abandonedCarts(),
		},
	});
}

const Controller = {
	addToCart,
	cart,
	removeFromCart,
	decreaseQuantityFromCart,
	abandonedCarts,
};

export default Controller;
