import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './checkout.controller';
import { BillingDetailsValidator, TransactionIDValidator } from './checkout.validator';

const router = express.Router();

router.route('/:id/retry-payment').all(VerifySession, IDValidator).post(Controller.initiatePayment);

router.route('/start-checkout').all(VerifySession).post(Controller.startCheckout);
router
	.route('/billing-details')
	.all(VerifySession, TransactionIDValidator, BillingDetailsValidator)
	.post(Controller.billingDetails);

router
	.route('/coupon')
	.all(VerifySession, TransactionIDValidator)
	.post(Controller.addCoupon)
	.delete(Controller.removeCoupon);

router
	.route('/initiate-payment-provider')
	.all(VerifySession, TransactionIDValidator)
	.post(Controller.initiatePayment);

router
	.route('/verify-payment')
	.all(VerifySession, TransactionIDValidator)
	.get(Controller.verifyPayment);

router.route('/').all(VerifySession, TransactionIDValidator).get(Controller.details);

export default router;
