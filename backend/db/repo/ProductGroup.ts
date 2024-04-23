import mongoose from 'mongoose';
import IProductGroup from '../types/product-group';

export const ProductGroupDB_name = 'ProductGroup';

const schema = new mongoose.Schema<IProductGroup>(
	{
		name: String,
		productCodes: [String],
	},
	{ timestamps: { createdAt: true } }
);

const ProductGroupDB = mongoose.model<IProductGroup>(ProductGroupDB_name, schema);

export default ProductGroupDB;
