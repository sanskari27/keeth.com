import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import CartController from './cart.controller';

const router = express.Router();

router
	.route('/:id')
	.all(VerifySession, IDValidator)
	.post(CartController.addToCart)
	.put(CartController.decreaseQuantityFromCart)
	.delete(CartController.removeFromCart);

router.route('/').all(VerifySession).get(CartController.cart);
export default router;
