import express from 'express';
import VerifySession from '../../middleware/VerifySession';
import { IDValidator } from '../../middleware/idValidator';
import UserController from './session.controller';

const router = express.Router();

router.route('/create-session').post(UserController.createSession);

router.route('/cart').all(VerifySession).get(UserController.cart);

router.route('/add-to-cart/:id').all(VerifySession, IDValidator).post(UserController.addToCart);
router
	.route('/decrease-quantity-from-cart/:id')
	.all(VerifySession, IDValidator)
	.post(UserController.decreaseQuantityFromCart);
router
	.route('/remove-from-cart/:id')
	.all(VerifySession, IDValidator)
	.post(UserController.removeFromCart);

export default router;
