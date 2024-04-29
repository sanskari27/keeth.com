import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './product-group.controller';
import { CreateValidator, ProductCodeValidator } from './product-group.validator';

const router = express.Router();

router.route('/similar-products/:code').get(Controller.fetchSimilarProducts);
router
	.route('/:id/products')
	.all(IDValidator)
	.get(Controller.listProducts)
	.post(ProductCodeValidator, Controller.addProduct)
	.delete(ProductCodeValidator, Controller.removeProduct);

router.route('/:id').all(IDValidator).patch(CreateValidator, Controller.updateGroup);

router.route('/').get(Controller.listGroups).post(CreateValidator, Controller.createGroup);

export default router;
