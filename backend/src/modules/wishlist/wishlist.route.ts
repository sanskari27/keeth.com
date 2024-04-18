import express from 'express';
import { IDValidator, VerifyAccount } from '../../middleware';
import WishlistController from './wishlist.controller';

const router = express.Router();

router
	.route('/:id')
	.all(VerifyAccount, IDValidator)
	.get(WishlistController.isInList)
	.post(WishlistController.addToList)
	.delete(WishlistController.removeFromList);

router.route('/').all(VerifyAccount).get(WishlistController.listAll);
export default router;
