import mongoose from 'mongoose';
import ICoupon from '../types/coupon';

export const CouponDB_name = 'Coupon';

const schema = new mongoose.Schema<ICoupon>({
	name: String,
	couponCode: {
		type: String,
		unique: true,
	},
	availableCoupon: Number,
	discountAmount: Number,
	discountPercentage: Number,
	discountType: String,
});

const CouponDB = mongoose.model<ICoupon>(CouponDB_name, schema);

export default CouponDB;
