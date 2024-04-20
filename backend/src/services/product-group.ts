import { Types } from 'mongoose';
import { ProductDB, ProductGroupDB } from '../../db';

export default class ProductGroupService {
	async listAll() {
		const groups = await ProductGroupDB.find();

		return groups.map((g) => ({
			id: g._id.toString(),
			name: g.name,
		}));
	}

	async productsInGroup(id: Types.ObjectId) {
		const group = await ProductGroupDB.findById(id);
		const product = await ProductDB.find({
			productCode: { $in: group?.productCodes ?? [] },
		}).distinct('productCode');

		return product.map((p) => p._id.toString()) as string[];
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

	async update(id: Types.ObjectId, name: string) {
		await ProductGroupDB.updateOne(
			{ _id: id },
			{
				$set: {
					name,
				},
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
