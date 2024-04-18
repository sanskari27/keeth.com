import { Document, Types } from 'mongoose';

export default interface ISession extends Document {
	_id: Types.ObjectId;
	cartItems: Types.ObjectId[];
}
