import { Types } from 'mongoose';
import { ProductDB, ProductGroupDB } from '../../db';

export default class ProductGroupService {
	async listAll() {
		const groups = await ProductGroupDB.find();

		return groups.map((g) => ({
			id: g._id.toString(),
			name: g.name,
			productCodes: g.productCodes,
		}));
	}

	async getSimilarProducts(code: string) {
		const group = await ProductGroupDB.find({
			productCodes: code,
		});

		const productCodes = group.map((p) => p.productCodes).flat();

		const product = await ProductDB.aggregate([
			{
				$match: {
					productCode: { $in: productCodes ?? [] },
				},
			},
			{
				$group: {
					_id: '$productCode',
					products: { $push: '$$ROOT' },
				},
			},
		]);

		return product
			.map((p) => (p.products.length > 0 ? [p.products[0]._id.toString()] : []))
			.flat() as string[];
	}

	async productsInGroup(id: Types.ObjectId) {
		const group = await ProductGroupDB.findById(id);

		const product = await ProductDB.aggregate([
			{
				$match: {
					productCode: { $in: group?.productCodes ?? [] },
				},
			},
			{
				$group: {
					_id: '$productCode',
					products: { $push: '$$ROOT' },
				},
			},
		]);

		return product
			.map((p) => (p.products.length > 0 ? [p.products[0]._id.toString()] : []))
			.flat() as string[];
	}

	async create(name: string, productCodes: string[] = []) {
		const group = await ProductGroupDB.create({
			name,
			productCodes,
		});
		return {
			id: group._id.toString(),
			name: group.name,
		};
	}

	async update(id: Types.ObjectId, details: { name: string; productCodes: string[] }) {
		await ProductGroupDB.updateOne(
			{ _id: id },
			{
				$set: details,
			}
		);
	}

	async addProduct(id: Types.ObjectId, productCodes: string[]) {
		await ProductGroupDB.updateOne(
			{ _id: id },
			{
				$addToSet: { productCodes: { $each: productCodes } },
			}
		);
	}

	async removeProduct(id: Types.ObjectId, productCodes: string[]) {
		await ProductGroupDB.updateOne(
			{ _id: id },
			{
				$pullAll: { productCodes },
			}
		);
	}
}
