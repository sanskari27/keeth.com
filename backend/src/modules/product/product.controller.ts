import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import CustomError, { COMMON_ERRORS } from '../../errors';
import { ProductsQueryValidatorResult } from '../../middleware';
import { ProductService } from '../../services';
import CollectionService from '../../services/collection';
import DateUtils from '../../utils/DateUtils';
import { Respond, intersection } from '../../utils/ExpressUtils';
import { CreateValidationResult } from './product.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listProducts(req: Request, res: Response, next: NextFunction) {
	const query = req.locals.query as ProductsQueryValidatorResult;

	const product_ids_1 = await new CollectionService().productsByCategory(query.collection_ids);
	const product_ids_2 = await new CollectionService().productsByTags(query.tags);
	let product_ids = Array.from(intersection(product_ids_1, product_ids_2)).map(
		(p) => new Types.ObjectId(p)
	);

	//If no collection_ids or tags is provided then fetch all products
	product_ids = query.collection_ids.length === 0 && query.tags.length === 0 ? [] : product_ids;

	let products = await new ProductService().products(product_ids, query);

	if (query.sort !== 'popular') {
		products = products.sort(function (a, b) {
			if (query.sort === 'new') {
				return DateUtils.getMoment(a.listedOn).isAfter(DateUtils.getMoment(b.listedOn)) ? -1 : 1;
			}
			if (query.sort === 'discount') {
				return b.discount - a.discount;
			}
			if (query.sort === 'low-high') {
				return a.price - b.price;
			}
			if (query.sort === 'high-low') {
				return b.price - a.price;
			}
			return 0;
		});
	}

	return Respond({
		res,
		status: 200,
		data: {
			products,
		},
	});
}

async function addProduct(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateValidationResult;

	const product = await new ProductService().create(data);

	return Respond({
		res,
		status: 201,
		data: {
			product,
		},
	});
}

async function updateProduct(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;
	const data = req.locals.data as CreateValidationResult;

	const product = await new ProductService().update(id, data);
	if (!product) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
	return Respond({
		res,
		status: 200,
		data: {
			product,
		},
	});
}

async function list(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;

	await new ProductService().setDiscontinued(id, false);
	return Respond({
		res,
		status: 200,
	});
}

async function unlist(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;

	await new ProductService().setDiscontinued(id, true);
	return Respond({
		res,
		status: 200,
	});
}

async function details(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;

	const product = await new ProductService().fetch(id);
	return Respond({
		res,
		status: 200,
		data: {
			product,
		},
	});
}

const Controller = {
	listProducts,
	addProduct,
	updateProduct,
	list,
	unlist,
	details,
};

export default Controller;
