import mongoose from 'mongoose';
import IProduct from '../types/product';

export const ProductDB_name = 'Product';

const schema = new mongoose.Schema<IProduct>(
	{
		name: {
			type: String,
			default: '',
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
		tags: {
			type: [String],
			default: [],
		},
		metal_color: {
			type: [String],
			default: [],
		},
		metal_type: {
			type: [String],
			default: [],
		},
		metal_quality: {
			type: [String],
			default: [],
		},
		diamond_type: {
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
		listed: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: { createdAt: true } }
);

const ProductDB = mongoose.model<IProduct>(ProductDB_name, schema);

export default ProductDB;
