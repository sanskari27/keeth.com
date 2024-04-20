import express from 'express';
import { IDValidator, ProductsQueryValidator } from '../../middleware';
import Controller from './product.controller';
import {  CreateValidator } from './product.validator';

const router = express.Router();

router.route('/:id/unlist').all(IDValidator).post(Controller.unlist);
router.route('/:id/list').all(IDValidator).post(Controller.list);

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
