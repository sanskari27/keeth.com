import { Document } from 'mongoose';

export default interface ICollection extends Document {
	name: string;
	collection_id: string;
	image: string;
	products: string[];
	tags: string[];
	visibleAtHome: boolean;
}
