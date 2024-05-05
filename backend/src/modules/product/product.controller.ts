import { NextFunction, Request, Response } from 'express';
import StorageDB from '../../../db/repo/Storage';
import CustomError, { COMMON_ERRORS } from '../../errors';
import { ProductsQueryValidatorResult } from '../../middleware';
import { ProductService } from '../../services';
import CollectionService from '../../services/collection';
import DateUtils from '../../utils/DateUtils';
import { Respond, RespondFile, intersection } from '../../utils/ExpressUtils';
import { CreateValidationResult, NewArrivalValidationResult } from './product.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listProducts(req: Request, res: Response, next: NextFunction) {
	let list = (await StorageDB.getObject('BEST_SELLER')) as string[];
	const query = req.locals.query as ProductsQueryValidatorResult;

	if (query.distinctProducts) {
		const products = await new ProductService().distinctProducts();
		return Respond({
			res,
			status: 200,
			data: {
				products: products.map((item) => ({
					...item,
					isBestSeller: list?.includes(item.productCode) ?? false,
				})),
			},
		});
	}

	const product_ids_1 = await new CollectionService().productsByCategory(query.collection_ids);
	const product_ids_2 = await new CollectionService().productsByTags(query.tags);

	let product_ids = Array.from(intersection(product_ids_1, product_ids_2));

	//If no collection_ids or tags is provided then fetch all products
	product_ids = query.collection_ids.length === 0 && query.tags.length === 0 ? [] : product_ids;

	let products = await new ProductService().products(product_ids, {
		...query,
		onlyIds: query.collection_ids.length > 0,
	});

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

async function markBestSeller(req: Request, res: Response, next: NextFunction) {
	const { productCode, status } = req.locals.data as NewArrivalValidationResult;

	let list = ((await StorageDB.getObject('BEST_SELLER')) as string[]) ?? [];
	if (status) {
		list = [...new Set([...list, productCode])];
	} else {
		list = list.filter((item) => item !== productCode);
	}

	await StorageDB.setObject('BEST_SELLER', list);

	return Respond({
		res,
		status: 200,
	});
}

async function fetchBestSellers(req: Request, res: Response, next: NextFunction) {
	const list = ((await StorageDB.getObject('BEST_SELLER')) as string[]) ?? [];
	const products = await new ProductService().productsByProductCodes(list);

	return Respond({
		res,
		status: 200,
		data: {
			products: products.map((p) => ({
				image: p.images.length > 0 ? p.images[0] : '',
				productCode: p.productCode,
			})),
		},
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

async function detailsByProductCode(req: Request, res: Response, next: NextFunction) {
	const product_code = req.params.product_code as string;
	if (!product_code) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	const products = await new ProductService().fetchByCode(product_code);
	return Respond({
		res,
		status: 200,
		data: {
			products,
		},
	});
}

async function productImage(req: Request, res: Response, next: NextFunction) {
	try {
		const product = await new ProductService().fetch(req.locals.id);
		const path = __basedir + '/static/' + product?.images[0];

		return RespondFile({
			res,
			filename: req.params.filename,
			filepath: path,
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	listProducts,
	addProduct,
	updateProduct,
	list,
	unlist,
	productImage,
	details,
	markBestSeller,
	fetchBestSellers,
	detailsByProductCode,
};

export default Controller;
