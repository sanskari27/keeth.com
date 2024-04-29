import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { ProductGroupService, ProductService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { CreateValidationResult, ProductCodesValidationResult } from './product-group.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listGroups(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			groups: await new ProductGroupService().listAll(),
		},
	});
}

async function listProducts(req: Request, res: Response, next: NextFunction) {
	let products = await new ProductGroupService().productsInGroup(req.locals.id);
	const details = await Promise.all(
		products.map((p) => new ProductService().fetch(new Types.ObjectId(p)))
	);

	return Respond({
		res,
		status: 200,
		data: {
			products,
			details,
		},
	});
}

async function fetchSimilarProducts(req: Request, res: Response, next: NextFunction) {
	const productIds = await new ProductGroupService().getSimilarProducts(req.params.code);
	const products = await Promise.all(
		productIds.map((p) => new ProductService().fetch(new Types.ObjectId(p)))
	);

	return Respond({
		res,
		status: 200,
		data: {
			products: products
				.filter((p) => !!p)
				.map((p) => {
					if (!p) return null;
					return {
						image: p.images.length > 0 ? p.images[0] : '',
						productCode: p.productCode,
						discount: p.discount,
						price: p.price,
					};
				}),
		},
	});
}

async function createGroup(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateValidationResult;

	const group = await new ProductGroupService().create(data.name, data.productCodes);

	return Respond({
		res,
		status: 201,
		data: {
			group,
		},
	});
}

async function updateGroup(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;
	const data = req.locals.data as CreateValidationResult;

	await new ProductGroupService().update(id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function addProduct(req: Request, res: Response, next: NextFunction) {
	const { productCodes } = req.locals.data as ProductCodesValidationResult;

	await new ProductGroupService().addProduct(req.locals.id, productCodes);

	return Respond({
		res,
		status: 200,
	});
}

async function removeProduct(req: Request, res: Response, next: NextFunction) {
	const { productCodes } = req.locals.data as ProductCodesValidationResult;

	await new ProductGroupService().removeProduct(req.locals.id, productCodes);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	listGroups,
	listProducts,
	addProduct,
	updateGroup,
	removeProduct,
	createGroup,
	fetchSimilarProducts,
};

export default Controller;
