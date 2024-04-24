import { Types } from 'mongoose';
import { CollectionDB } from '../../db';

export default class CollectionService {
	async listAll() {
		const collections = await CollectionDB.find();

		return collections.map((collection) => ({
			id: collection.collection_id,
			name: collection.name,
			image: collection.image,
			tags: collection.tags,
			visibleAtHome: collection.visibleAtHome ?? false,
		}));
	}

	async fetch(id: string) {
		const collection = await CollectionDB.findOne({
			collection_id: id,
		});
		if (!collection) {
			return null;
		}
		return {
			id: collection.collection_id,
			name: collection.name,
			image: collection.image,
			tags: collection.tags,
		};
	}

	async create(id: string, name: string, image: string = '') {
		await CollectionDB.create({
			collection_id: id,
			name,
			image,
		});
	}

	async updateImage(id: string, image: string) {
		await CollectionDB.updateOne(
			{
				collection_id: id,
			},
			{
				$set: {
					image: image,
				},
			}
		);
	}

	async updateHomeVisibility(id: string, visible: boolean) {
		await CollectionDB.updateOne(
			{
				collection_id: id,
			},
			{
				$set: {
					visibleAtHome: visible,
				},
			}
		);
	}

	async remove(id: string) {
		await CollectionDB.deleteMany({
			collection_id: id,
		});
	}

	async addTag(id: string, tags: string[]) {
		await CollectionDB.updateOne(
			{
				collection_id: id,
			},
			{
				$addToSet: {
					tags: { $each: tags },
				},
			}
		);
	}

	async replaceTags(id: string, tags: string[]) {
		await CollectionDB.updateOne(
			{
				collection_id: id,
			},
			{
				$set: {
					tags,
				},
			}
		);
	}

	async removeTags(id: string, tags: string[]) {
		await CollectionDB.updateOne(
			{
				collection_id: id,
			},
			{
				$pullAll: {
					tags: tags,
				},
			}
		);
	}

	async addProducts(collection_id: string, ids: Types.ObjectId[]) {
		await CollectionDB.updateOne(
			{
				collection_id: collection_id,
			},
			{
				$addToSet: {
					products: { $each: ids },
				},
			}
		);
	}

	async removeProducts(collection_id: string, ids: Types.ObjectId[]) {
		await CollectionDB.updateOne(
			{
				collection_id: collection_id,
			},
			{
				$pullAll: {
					products: ids,
				},
			}
		);
	}

	async productsByCategory(ids: string[]) {
		let query = {};

		if (ids.length > 0) {
			query = {
				collection_id: {
					$in: ids,
				},
			};
		}
		const collections = await CollectionDB.find(query);
		return collections.map((c) => c.products).flat();
	}

	async productsByTags(ids: string[]) {
		let query = {};

		if (ids.length > 0) {
			query = {
				tags: {
					$in: ids,
				},
			};
		}
		const collections = await CollectionDB.find(query);
		return collections.map((c) => c.products).flat();
	}
}
