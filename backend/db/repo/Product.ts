import mongoose from 'mongoose';
import IProduct from '../types/product';

export const ProductDB_name = 'Product';

const schema = new mongoose.Schema<IProduct>(
	{
		productCode: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		details: {
			type: String,
			default: '',
		},
		pricing_bifurcation: {
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
		size: {
			type: String,
			default: null,
		},
		metal_color: String,
		metal_type: String,
		metal_quality: String,
		diamond_type: String,
		price: {
			type: Number,
			default: 0,
		},
		discount: {
			type: Number,
			default: 0,
		},
		discontinued: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: { createdAt: true } }
);

const ProductDB = mongoose.model<IProduct>(ProductDB_name, schema);

export default ProductDB;
