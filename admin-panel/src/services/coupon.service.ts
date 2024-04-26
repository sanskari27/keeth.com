import APIInstance from '../config/APIInstance';
import { Coupon } from '../store/types/CouponState';

export default class CouponService {
	static async listCoupons() {
		try {
			const { data } = await APIInstance.get(`/coupon`);
			return data.coupons as Coupon[];
		} catch (err) {
			return [];
		}
	}

	static async createCoupon(details: Coupon) {
		try {
			await APIInstance.post(`/coupon`, details);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async updateCoupon(id: string, details: Coupon) {
		try {
			await APIInstance.put(`/coupon/${id}`, details);
			return true;
		} catch (err) {
			return false;
		}
	}
}
