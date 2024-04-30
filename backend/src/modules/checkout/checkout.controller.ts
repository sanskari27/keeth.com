import { NextFunction, Request, Response } from 'express';
import CustomError, { COMMON_ERRORS, ERRORS } from '../../errors';
import { CartService, CheckoutService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { BillingDetailsValidationResult } from './checkout.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listAllOrders(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			orders: await CheckoutService.getAllOrders(),
		},
	});
}

async function startCheckout(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;

	try {
		const cart = new CartService(session);
		const transaction_id = await CheckoutService.startCheckout(cart);

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
		const checkout_service = new CheckoutService(cart, transaction_id);

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
		const checkout_service = new CheckoutService(cart, transaction_id);

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
		const checkout_service = new CheckoutService(cart, transaction_id);

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
		const checkout_service = new CheckoutService(cart, transaction_id);

		const payment_link = await checkout_service.initiatePayment();
		return Respond({
			res,
			status: 200,
			data: {
				payment_link,
			},
		});
	} catch (err) {
		next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}
}

async function verifyPayment(req: Request, res: Response, next: NextFunction) {
	const session = req.locals.session;
	const transaction_id = req.locals.id;

	const cart = new CartService(session);
	const checkout_service = new CheckoutService(cart, transaction_id);

	const status = await checkout_service.verifyPayment();
	return Respond({
		res,
		status: 200,
		data: { status },
	});
}

const Controller = {
	listAllOrders,
	startCheckout,
	billingDetails,
	addCoupon,
	removeCoupon,
	initiatePayment,
	verifyPayment,
};

export default Controller;
