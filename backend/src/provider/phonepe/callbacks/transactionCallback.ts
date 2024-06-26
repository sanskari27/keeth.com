import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { CheckoutService } from '../../../services';
import PhonePeAPI from '../config/PhonePeAPI';

export default async function (req: Request, res: Response) {
	const { response: encodedData } = req.body;

	const x_verify = req.headers['X-VERIFY'];
	if (PhonePeAPI.verifyHeader(x_verify as string, encodedData) === false) {
		res.sendStatus(403);
	}

	const decodedData = Buffer.from(encodedData, 'base64').toString('ascii');
	const order = JSON.parse(decodedData);

	const merchantTransactionId = new Types.ObjectId(order.merchantTransactionId);
	const transactionId = order.transactionId;
	const status = order.code as
		| 'PAYMENT_SUCCESS'
		| 'BAD_REQUEST'
		| 'AUTHORIZATION_FAILED'
		| 'INTERNAL_SERVER_ERROR'
		| 'TRANSACTION_NOT_FOUND'
		| 'PAYMENT_ERROR'
		| 'PAYMENT_PENDING'
		| 'PAYMENT_DECLINED'
		| 'TIMED_OUT';

	switch (status) {
		case 'PAYMENT_SUCCESS':
			await CheckoutService.confirmPayment(merchantTransactionId, transactionId);
			break;
		case 'PAYMENT_PENDING':
			break;
		default:
			await CheckoutService.failedPayment(merchantTransactionId);
	}
	return res.sendStatus(200);
}
