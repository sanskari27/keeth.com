import { Document, Types } from 'mongoose';

export default interface IProductGroup extends Document {
	_id: Types.ObjectId;
	name: string;
	productCodes: string[];
}
