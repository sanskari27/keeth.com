import express from 'express';
import { IDValidator, ProductsQueryValidator } from '../../middleware';
import { VerifyAdmin } from '../../middleware/VerifySession';
import Controller from './product.controller';
import { CreateValidator, NewArrivalValidator } from './product.validator';

const router = express.Router();

router
	.route('/best-sellers')
	.get(Controller.fetchBestSellers)
	.all(VerifyAdmin, NewArrivalValidator)
	.post(Controller.markBestSeller);

router.route('/product-code/:product_code').get(Controller.detailsByProductCode);

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
