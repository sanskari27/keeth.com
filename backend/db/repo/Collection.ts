import mongoose, { Schema } from 'mongoose';
import ICollection from '../types/collection';
import { ProductOptionDB_name } from './ProductOption';

export const CollectionDB_name = 'Collection';

const schema = new mongoose.Schema<ICollection>({
	name: String,
	collection_id: {
		type: String,
		unique: true,
	},
	image: String,
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: ProductOptionDB_name,
		},
	],
	tags: {
		type: [String],
		default: [],
	},
});

const CollectionDB = mongoose.model<ICollection>(CollectionDB_name, schema);

export default CollectionDB;