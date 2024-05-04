import express from 'express';
import { IDValidator } from '../../middleware';
import { VerifyAccount, VerifyAdmin } from '../../middleware/VerifySession';
import Controller from './orders.controller';

const router = express.Router();

router.route('/orders').all(VerifyAdmin).get(Controller.listAllOrders);
router.route('/my-orders').all(VerifyAccount).get(Controller.listUserOrders);

router.route('/:id/cancel').all(VerifyAccount, IDValidator).post(Controller.cancelOrder);
router.route('/:id/accept-return').all(VerifyAdmin, IDValidator).post(Controller.acceptReturn);
router.route('/:id/reject-return').all(VerifyAdmin, IDValidator).post(Controller.rejectReturn);

router
	.route('/:id/request-return')
	.all(VerifyAccount, IDValidator)
	.post(Controller.requestReturn)
	.delete(Controller.cancelReturnRequest);

router.route('/:id/tracking').all(VerifyAdmin, IDValidator).post(Controller.setTrackingID);
router.route('/:id/status').all(VerifyAdmin, IDValidator).post(Controller.changeOrderStatus);

export default router;
