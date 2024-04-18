import mongoose, { Schema } from 'mongoose';
import { IProductOption } from '../types/product';

export const ProductOptionDB_name = 'ProductOption';

const schema = new mongoose.Schema<IProductOption>({
	product: {
		type: Schema.Types.ObjectId,
		ref: ProductOptionDB_name,
	},
	productCode: {
		type: String,
		unique: true,
	},
	description: {
		type: String,
		default: '',
	},
	images: {
		type: [String],
		default: [],
	},
	videos: {
		type: [String],
		default: [],
	},
	price: {
		type: Number,
		default: 0,
	},
	discount: {
		type: Number,
		default: 0,
	},
	metal_color: String,
	metal_type: String,
	metal_quality: String,
	diamond_type: String,
});

schema.index(
	{ product: 1, metal_color: 1, metal_type: 1, metal_quality: 1, diamond_type: 1 },
	{ unique: true }
);

const ProductOptionDB = mongoose.model<IProductOption>(ProductOptionDB_name, schema);

export default ProductOptionDB;
