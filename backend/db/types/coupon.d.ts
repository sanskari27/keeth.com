import { Document, Types } from 'mongoose';

export default interface ICoupon extends Document {
	_id: Types.ObjectId;
	name: string;
	couponCode: string;
	availableCoupon: number;
	discountAmount: number;
	discountPercentage: number;
	discountType: 'amount' | 'percentage';
}
