import { NextFunction, Request, Response } from 'express';
import { IS_PRODUCTION, TRANSACTION_COOKIE } from '../../config/const';
import CustomError, { COMMON_ERRORS, ERRORS } from '../../errors';
import { CartService, CheckoutService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { BillingDetailsValidationResult } from './checkout.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function details(req: Request, res: Response, next: NextFunction) {
	const email = await req.locals.session.getEmailById();
	if (!email) {
		return Respond({
			res,
			status: 200,
			data: {
				orders: [],
			},
		});
	}

	const session = req.locals.session;
	const transaction_id = req.locals.id;

	try {
		const cart = new CartService(session);
		const checkout_service = new CheckoutService(transaction_id, cart);

		return Respond({
			res,
			status: 200,
			data: {
				transaction: await checkout_service.getDetails(),
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function startCheckout(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const _transaction_id = req.cookies[TRANSACTION_COOKIE];
	if (await CheckoutService.validTransactionID(_transaction_id)) {
		return Respond({
			res,
			status: 200,
			data: {
				transaction_id: _transaction_id,
			},
		});
	}

	try {
		const cart = new CartService(session);
		const transaction_id = await CheckoutService.startCheckout(cart);

		res.cookie(TRANSACTION_COOKIE, transaction_id, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
		});

		return Respond({
			res,
			status: 200,
			data: {
				transaction_id,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function billingDetails(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const transaction_id = req.locals.id;
	const data = req.locals.data as BillingDetailsValidationResult;

	try {
		const cart = new CartService(session);
		const checkout_service = new CheckoutService(transaction_id, cart);

		const success = await checkout_service.addBillingDetails(data);
		return Respond({
			res,
			status: success ? 200 : 400,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function addCoupon(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const transaction_id = req.locals.id;
	const coupon = req.body.coupon as string;
	if (!coupon) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const cart = new CartService(session);
		const checkout_service = new CheckoutService(transaction_id, cart);

		await checkout_service.addCoupon(coupon);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function removeCoupon(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const transaction_id = req.locals.id;

	try {
		const cart = new CartService(session);
		const checkout_service = new CheckoutService(transaction_id, cart);

		await checkout_service.removeCoupon();
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function initiatePayment(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const transaction_id = req.locals.id;

	try {
		const cart = new CartService(session);
		const checkout_service = new CheckoutService(transaction_id, cart);

		const payment_link = await checkout_service.initiatePayment();
		return Respond({
			res,
			status: 200,
			data: {
				redirect: payment_link !== null,
				payment_link,
			},
		});
	} catch (err) {
		console.log(err);

		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function verifyPayment(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const transaction_id = req.locals.id;

	const cart = new CartService(session);
	const checkout_service = new CheckoutService(transaction_id, cart);

	const status = await checkout_service.verifyPayment();
	return Respond({
		res,
		status: 200,
		data: { status },
	});
}

const Controller = {
	startCheckout,
	billingDetails,
	addCoupon,
	removeCoupon,
	initiatePayment,
	verifyPayment,
	details,
};

export default Controller;
