import APIInstance from '../config/APIInstance';
import { Collection } from '../store/types/CollectionsState';

export default class CollectionService {
	static getCollectionId(input: string) {
		let result = input.replace(/[^a-zA-Z0-9]/g, '-');
		result = result.replace(/-+/g, '-');
		result = result.replace(/^-+|-+$/g, '');
		return result.toLowerCase();
	}
	static async getCollection(): Promise<Collection[]> {
		try {
			const { data } = await APIInstance.get(`/collections`);
			return data.collections.map((c: Collection) => ({
				id: c.id as string,
				name: c.name as string,
				image: c.image as string,
				tags: c.tags as string[],
				visibleAtHome: c.visibleAtHome as boolean,
				productCodes: c.productCodes as string[],
			}));
		} catch (err) {
			return [];
		}
	}
	static async updateVisibility(id: string, isVisible: boolean) {
		try {
			await APIInstance.patch(`/collections/${id}/home-visibility`, {
				isVisible,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async createCollection(
		id: string,
		name: string,
		image: string
	): Promise<Collection | null> {
		try {
			await APIInstance.post(`/collections`, {
				id,
				name,
				image,
			});
			return {
				id,
				name,
				image,
				tags: [],
				visibleAtHome: false,
				productCodes: [],
			} satisfies Collection;
		} catch (err) {
			return null;
		}
	}

	static async updateCollectionImage(id: string, file: File) {
		try {
			const formData = new FormData();
			formData.append('file', file);
			await APIInstance.patch(`/collections/${id}`, {
				image: file,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async updateCollectionTags(id: string, tags: string[]) {
		try {
			await APIInstance.put(`/collections/${id}/tags`, {
				tags: tags,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async updateProductsInCollection(id: string, productCodes: string[]) {
		try {
			await APIInstance.post(`/collections/${id}/products`, {
				products: productCodes,
			});
			return true;
		} catch (err) {
			return false;
		}
	}
}
