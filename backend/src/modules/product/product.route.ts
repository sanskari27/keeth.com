import express from 'express';
import { IDValidator, ProductsQueryValidator } from '../../middleware';
import Controller from './product.controller';
import { CreateProductOptionValidator, CreateValidator } from './product.validator';

const router = express.Router();

router.route('/:id/unlist').all(IDValidator).post(Controller.unlist);
router.route('/:id/list').all(IDValidator).post(Controller.list);

router
	.route('/:id/product-options')
	.all(IDValidator, CreateProductOptionValidator)
	.post(Controller.createProductOption)
	.put(Controller.updateProductOption);

router
	.route('/:id')
	.all(IDValidator)
	.get(Controller.details)
	.put(CreateValidator, Controller.updateProduct);

router
	.route('/')
	.get(ProductsQueryValidator, Controller.listProducts)
	.post(CreateValidator, Controller.addProduct);

export default router;
