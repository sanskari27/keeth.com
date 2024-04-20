import { Types } from 'mongoose';
import { ProductDB } from '../../db';
import IProduct from '../../db/types/product';
import { filterUndefinedKeys } from '../utils/ExpressUtils';

type ProductDetails = {
	productCode: String;
	name: string;
	description: string;
	details: string;
	pricing_bifurcation: string;
	images: string[];
	videos: string[];
	tags: string[];
	size: string | null;
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string;
	price: number;
	discount: number;
	listed: boolean;
};

const formatProduct = (p: IProduct) => ({
	id: p._id,
	productCode: p.productCode,
	name: p.name,
	description: p.description,
	details: p.details,
	pricing_bifurcation: p.pricing_bifurcation,
	images: p.images,
	videos: p.videos,
	tags: p.tags,
	size: p.size,
	metal_color: p.metal_color,
	metal_type: p.metal_type,
	metal_quality: p.metal_quality,
	diamond_type: p.diamond_type,
	price: p.price,
	discount: p.discount,
	listed: p.listed,
	discontinued: p.discontinued,
	listedOn: p.createdAt,
});

export default class ProductService {
	async listAll() {
		const products = await ProductDB.find();

		return products.map((p) => formatProduct(p));
	}

	async fetch(id: Types.ObjectId) {
		const product = await ProductDB.findById(id);
		if (!product) {
			return null;
		}

		return formatProduct(product);
	}

	async fetchByCode(code: string) {
		const products = await ProductDB.find({
			productCode: code,
		});

		return products.map((p) => formatProduct(p));
	}

	async create(opt: ProductDetails) {
		const p = await ProductDB.create(opt);

		return formatProduct(p);
	}

	async update(id: Types.ObjectId, opt: Partial<ProductDetails>) {
		opt = filterUndefinedKeys(opt);
		await ProductDB.updateOne({ _id: id }, { $set: opt });

		const p = await ProductDB.findById(id);
		if (!p) {
			return null;
		}

		return formatProduct(p);
	}

	async setDiscontinued(id: Types.ObjectId, isDiscontinued: boolean) {
		await ProductDB.updateOne(
			{
				_id: id,
			},
			{
				$set: { listed: isDiscontinued },
			}
		);
	}

	async products(
		ids: Types.ObjectId[],
		query: {
			price_min: number;
			price_max: number;
			metals: string[];
			purity: ('14K' | '18K' | '22K')[];
			skip: number;
			limit: number;
		}
	) {
		let _query = {};

		if (ids.length > 0) {
			_query = {
				_id: { $in: ids },
			};
		}
		if (query.metals.length > 0) {
			_query = {
				metal_color: { $in: query.metals },
			};
		}
		if (query.metals.length > 0) {
			_query = {
				metal_type: { $in: query.metals },
			};
		}
		if (query.purity.length > 0) {
			_query = {
				..._query,
				metal_quality: { $in: query.purity },
			};
		}

		const products = await ProductDB.find({
			listed: true,
			price: { $lte: query.price_max, $gte: query.price_min },
			..._query,
		})
			.skip(query.skip)
			.limit(query.limit);

		return products.map((p) => formatProduct(p));
	}
}
