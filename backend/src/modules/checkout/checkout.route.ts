import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './checkout.controller';
import { BillingDetailsValidator } from './checkout.validator';

const router = express.Router();

router.route('/start-checkout').all(VerifySession).post(Controller.startCheckout);
router
	.route('/:id/billing-details')
	.all(VerifySession, IDValidator, BillingDetailsValidator)
	.post(Controller.billingDetails);

router
	.route('/:id/coupon')
	.all(VerifySession, IDValidator)
	.post(Controller.addCoupon)
	.delete(Controller.removeCoupon);

router
	.route('/:id/initiate-payment-provider')
	.all(VerifySession, IDValidator)
	.post(Controller.initiatePayment);

router.route('/:id/verify-payment').all(VerifySession, IDValidator).get(Controller.verifyPayment);
router.route('/:id').all(VerifySession, IDValidator).get(Controller.details);

export default router;
