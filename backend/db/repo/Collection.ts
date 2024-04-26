import mongoose from 'mongoose';
import ICollection from '../types/collection';

export const CollectionDB_name = 'Collection';

const schema = new mongoose.Schema<ICollection>({
	name: String,
	collection_id: {
		type: String,
		unique: true,
	},
	image: String,
	products: [String],
	tags: {
		type: [String],
		default: [],
	},
	visibleAtHome: {
		type: Boolean,
		default: false,
	},
});

const CollectionDB = mongoose.model<ICollection>(CollectionDB_name, schema);

export default CollectionDB;
