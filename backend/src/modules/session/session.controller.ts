import { NextFunction, Request, Response } from 'express';
import { IS_PRODUCTION, SESSION_COOKIE } from '../../config/const';
import CustomError, { ERRORS } from '../../errors';
import SessionService from '../../services/session';
import { Respond } from '../../utils/ExpressUtils';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function createSession(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];

	if (_session_id) {
		try {
			await SessionService.getSession(_session_id);
			return Respond({
				res,
				status: 200,
			});
		} catch (err) {
			//ignored
		}
	}

	const session = await SessionService.createSession();

	res.cookie(SESSION_COOKIE, session.id, {
		sameSite: 'none',
		expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
	});

	return Respond({
		res,
		status: 200,
	});
}

async function cart(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;

	try {
		const cart = await session.getCart();
		const total = cart.reduce((acc, item) => {
			return (acc += item.quantity * item.product_option.price);
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
	const product_option = req.body.product_option as string;
	if (!product_option) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		await session.addToCart(product_id, product_option);
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
		await session.removeQuantityFromCart(product_id);
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
		await session.removeFromCart(product_id);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

const AuthController = {
	createSession,
	addToCart,
	cart,
	removeFromCart,
	decreaseQuantityFromCart,
};

export default AuthController;
