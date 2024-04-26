import { Types } from 'mongoose';
import { CouponDB } from '../../db';
import CustomError, { COMMON_ERRORS } from '../errors';
import { filterUndefinedKeys } from '../utils/ExpressUtils';

export default class CouponService {
	async listAll() {
		const coupons = await CouponDB.find();

		return (
			coupons.map((c) => ({
				id: c._id,
				name: c.name,
				couponCode: c.couponCode,
				availableCoupon: c.availableCoupon,
				discountAmount: c.discountAmount,
				discountPercentage: c.discountPercentage,
				discountType: c.discountType,
			})) ?? []
		);
	}

	async fetch(couponCode: string) {
		const coupon = await CouponDB.findOne({ couponCode });

		if (!coupon) {
			return null;
		}

		return {
			name: coupon.name,
			couponCode: coupon.couponCode,
			availableCoupon: coupon.availableCoupon,
			discountAmount: coupon.discountAmount,
			discountPercentage: coupon.discountPercentage,
			discountType: coupon.discountType,
		};
	}

	public async add(details: {
		name: string;
		couponCode: string;
		availableCoupon: number;
		discountAmount: number;
		discountPercentage: number;
		discountType: 'amount' | 'percentage';
	}) {
		try {
			const coupon = await CouponDB.create(details);
			return {
				name: coupon.name,
				couponCode: coupon.couponCode,
				availableCoupon: coupon.availableCoupon,
				discountAmount: coupon.discountAmount,
				discountPercentage: coupon.discountPercentage,
				discountType: coupon.discountType,
			};
		} catch (err) {
			throw new CustomError(COMMON_ERRORS.ALREADY_EXISTS);
		}
	}

	public async update(
		id: Types.ObjectId,
		details: Partial<{
			name: string;
			couponCode: string;
			availableCoupon: number;
			discountAmount: number;
			discountPercentage: number;
			discountType: 'amount' | 'percentage';
		}>
	) {
		details = filterUndefinedKeys(details);
		await CouponDB.updateOne({ _id: id }, { $set: details });
	}

	public async remove(id: Types.ObjectId) {
		await CouponDB.deleteOne({ _id: id });
	}
}
