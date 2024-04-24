import { Document, Types } from 'mongoose';

export default interface ICollection extends Document {
	name: string;
	collection_id: string;
	image: string;
	products: Types.ObjectId[];
	tags: string[];
	visibleAtHome: boolean;
}
