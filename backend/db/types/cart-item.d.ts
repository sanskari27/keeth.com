import { Document, Types } from 'mongoose';

export default interface ICartItem extends Document {
	quantity: number;
	cart_id: Types.ObjectId;
	product: Types.ObjectId;
}
