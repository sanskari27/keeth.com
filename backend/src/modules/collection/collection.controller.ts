import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import CustomError, { ERRORS } from '../../errors';
import CollectionService from '../../services/collection';
import { Respond } from '../../utils/ExpressUtils';
import { CreateValidationResult } from './collection.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listCollections(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			collections: await new CollectionService().listAll(),
		},
	});
}

async function create(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateValidationResult;

	try {
		await new CollectionService().create(data.id, data.name, data.image);
	} catch (err) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.ALREADY_EXISTS));
	}

	return Respond({
		res,
		status: 200,
		data: {
			id: data.id,
			name: data.name,
		},
	});
}

async function updateImage(req: Request, res: Response, next: NextFunction) {
	const data = req.body.image as string;

	try {
		await new CollectionService().updateImage(req.locals.collection_id, data);
	} catch (err) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.ALREADY_EXISTS));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function remove(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.collection_id;

	await new CollectionService().remove(data);

	return Respond({
		res,
		status: 200,
	});
}

async function updateVisibility(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as boolean;

	await new CollectionService().updateHomeVisibility(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function addTags(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().addTag(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function replaceTags(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().replaceTags(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function removeTags(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().removeTags(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function addProducts(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as Types.ObjectId[];

	await new CollectionService().addProducts(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function removeProducts(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as Types.ObjectId[];

	await new CollectionService().removeProducts(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	listCollections,
	updateImage,
	create,
	updateVisibility,
	remove,
	addTags,
	replaceTags,
	removeTags,
	addProducts,
	removeProducts,
};

export default Controller;
