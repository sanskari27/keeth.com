import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import { VerifyAdmin } from '../../middleware/VerifySession';
import Controller from './checkout.controller';
import { BillingDetailsValidator } from './checkout.validator';

const router = express.Router();

router.route('/orders').all(VerifyAdmin).get(Controller.listAllOrders);
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

export default router;
