import APIInstance from '../config/APIInstance';
import { Product, ProductDetails } from '../store/types/ProductsState';

export default class ProductService {
	static async listDistinctProducts() {
		try {
			const { data } = await APIInstance.get(`/products?distinctProducts=true`);
			return data.products as Product[];
		} catch (err) {
			return [];
		}
	}

	static async fetchDetails(id: string) {
		try {
			const { data } = await APIInstance.get(`/products/${id}`);
			return data.product as ProductDetails;
		} catch (err) {
			return null;
		}
	}

	static async listCustomizations(productCode: string) {
		try {
			const { data } = await APIInstance.get(`/products/product-code/${productCode}`);
			return data.products as ProductDetails[];
		} catch (err) {
			return [];
		}
	}

	static async updateBestSeller(productCode: string, status: boolean) {
		try {
			await APIInstance.post(`/products/best-sellers`, {
				productCode,
				status,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async updateListing(product_id: string, listed: boolean) {
		try {
			await APIInstance.post(`/products/${product_id}/${listed ? 'list' : 'unlist'}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async updateProduct(
		product_id: string,
		details: Omit<ProductDetails, 'discontinued' | 'listedOn' | 'images' | 'videos'> & {
			images: string[] | undefined;
			videos: string[] | undefined;
		}
	) {
		try {
			await APIInstance.put(`/products/${product_id}`, {
				...details,
				price: Number(details.price),
				discount: Number(details.discount),
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async createProduct(
		details: Omit<ProductDetails, 'discontinued' | 'listedOn' | 'images' | 'videos'> & {
			images: string[] | undefined;
			videos: string[] | undefined;
		}
	) {
		try {
			await APIInstance.post(`/products`, {
				...details,
				price: Number(details.price),
				discount: Number(details.discount),
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async listProductGroups() {
		try {
			const { data } = await APIInstance.get(`/product-group`);
			return data.groups as {
				id: string;
				name: string;
				productCodes: string[];
			}[];
		} catch (err) {
			return [];
		}
	}

	static async createProductGroup(details: { name: string; productCodes: string[] }) {
		try {
			const { data } = await APIInstance.post(`/product-group`, details);
			return {
				id: data.group.id,
				...details,
			};
		} catch (err) {
			return null;
		}
	}

	static async updateProductGroup(id: string, details: { name: string; productCodes: string[] }) {
		try {
			await APIInstance.patch(`/product-group/${id}`, details);
			return {
				id: id,
				...details,
			};
		} catch (err) {
			return null;
		}
	}
}
