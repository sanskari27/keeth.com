import { Document, Types } from 'mongoose';

export default interface IWishlist extends Document {
	account: Types.ObjectId;
	products: Types.ObjectId[];
}
