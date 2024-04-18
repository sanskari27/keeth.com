import { Types } from 'mongoose';
import { CartItemDB, ProductDB, ProductOptionDB, WishlistDB } from '../../db';
import CustomError, { COMMON_ERRORS } from '../errors';
import { filterUndefinedKeys } from '../utils/ExpressUtils';

type ProductDetails = {
	name: string;
	description: string;
	images: string[];
	videos: string[];
	price: number;
	discount: number;
};

type ProductOptionDetails = {
	productCode: String;
	description: String;
	images: String[];
	videos: String[];
	price: Number;
	discount: Number;
	metal_color: String;
	metal_type: String;
	metal_quality: String;
	diamond_type: String;
};

export default class ProductService {
	async listAll() {
		const products = await ProductDB.find();

		return products.map((p) => ({
			id: p._id,
			name: p.name,
			description: p.description,
			images: p.images,
			videos: p.videos,
			price: p.price,
			discount: p.discount,
			listed: p.listed,
		}));
	}

	async fetch(id: Types.ObjectId) {
		const product = await ProductDB.findById(id);
		if (!product) {
			return null;
		}

		const options = await ProductOptionDB.find({ product });

		return {
			product: {
				productId: product._id,
				name: product.name,
				description: product.description,
				images: product.images,
				videos: product.videos,
			},
			options: options.map((opt) => ({
				productOptionId: opt._id,
				productCode: opt.productCode,
				description: opt.description,
				images: opt.images,
				videos: opt.videos,
				price: opt.price,
				discount: opt.discount,
				metal_color: opt.metal_color,
				metal_type: opt.metal_type,
				metal_quality: opt.metal_quality,
				diamond_type: opt.diamond_type,
			})),
		};
	}

	async fetchProductOption(id: Types.ObjectId, productOptionId: Types.ObjectId) {
		const product = await ProductDB.findById(id);
		if (!product) {
			return null;
		}

		const option = await ProductOptionDB.findOne({ product, _id: productOptionId });
		if (!option) {
			return null;
		}

		return {
			product: {
				productId: product._id,
				name: product.name,
				description: product.description,
				images: product.images,
				videos: product.videos,
			},
			option: {
				productOptionId: option._id,
				productCode: option.productCode,
				description: option.description,
				images: option.images,
				videos: option.videos,
				price: option.price,
				discount: option.discount,
				metal_color: option.metal_color,
				metal_type: option.metal_type,
				metal_quality: option.metal_quality,
				diamond_type: option.diamond_type,
			},
		};
	}

	async create(opt: ProductDetails) {
		const p = await ProductDB.create(opt);

		return {
			id: p._id,
			name: p.name,
			description: p.description,
			images: p.images,
			videos: p.videos,
			price: p.price,
			discount: p.discount,
		};
	}

	async update(id: Types.ObjectId, opt: Partial<ProductDetails>) {
		opt = filterUndefinedKeys(opt);
		await ProductDB.updateOne({ _id: id }, { $set: opt });

		const p = await ProductDB.findById(id);
		if (!p) {
			return null;
		}

		return {
			id: p._id,
			name: p.name,
			description: p.description,
			images: p.images,
			videos: p.videos,
			price: p.price,
			discount: p.discount,
		};
	}

	async createProductOption(id: Types.ObjectId, opt: ProductOptionDetails) {
		try {
			await ProductOptionDB.create({
				product: id,
				...opt,
			});
		} catch (err) {
			throw new CustomError(COMMON_ERRORS.ALREADY_EXISTS);
		}
	}

	async updateProductOption(
		id: Types.ObjectId,
		opt: Partial<Omit<ProductOptionDetails, 'productCode'>>
	) {
		opt = filterUndefinedKeys(opt);
		await ProductOptionDB.updateOne({ _id: id }, { $set: opt });
	}

	async list(id: Types.ObjectId) {
		await ProductDB.updateOne(
			{
				_id: id,
			},
			{
				listed: true,
			}
		);
	}

	async unlist(id: Types.ObjectId) {
		await ProductDB.updateOne(
			{
				_id: id,
			},
			{
				listed: false,
			}
		);
		await CartItemDB.deleteMany({ product: id });
		await WishlistDB.updateMany(
			{},
			{
				$pull: {
					products: id,
				},
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

		return products.map((p) => ({
			id: p._id,
			name: p.name,
			description: p.description,
			images: p.images,
			videos: p.videos,
			price: p.price,
			discount: p.discount,
			listed_on: p.createdAt,
		}));
	}
}
