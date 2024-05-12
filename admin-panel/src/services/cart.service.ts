import APIInstance from '../config/APIInstance';
import { Cart } from '../views/pages/abandoned-carts';
import { Order } from '../views/pages/orders';
import { OrderDetails } from '../views/pages/orders/components/OrderDetails';

export default class CartService {
	static async statistics() {
		try {
			const { data } = await APIInstance.get(`/statistics`);
			return data;
		} catch (err) {
			return {
				overall: {
					totalOrders: 0,
					totalGrossSales: 0,
					totalDiscounts: 0,
					totalCouponDiscounts: 0,
					totalAmountCollected: 0,
					uniqueCustomersCount: 0,
				},
				monthly: [],
			};
		}
	}
	static async abandonedCarts() {
		try {
			const { data } = await APIInstance.get(`/cart/abandoned-carts`);
			return data.carts as Cart[];
		} catch (err) {
			return [];
		}
	}

	static async getOrders(query?: { startDate: Date; endDate: Date }) {
		try {
			const { data } = await APIInstance.get(`/orders`, {
				params: query,
			});
			return data.orders as Order[];
		} catch (err) {
			return [];
		}
	}

	static async acceptReturn(id: string) {
		try {
			await APIInstance.post(`/orders/${id}/accept-return`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async rejectReturn(id: string) {
		try {
			await APIInstance.post(`/orders/${id}/reject-return`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async saveTrackingID(id: string, tracking_number: string) {
		try {
			await APIInstance.post(`/orders/${id}/tracking`, {
				tracking_number,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async updateTrackingStatus(id: string, status: string) {
		try {
			await APIInstance.post(`/orders/${id}/status`, {
				status,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async initiateRefund(id: string, amount: number) {
		try {
			await APIInstance.post(`/orders/${id}/initiate-refund`, {
				amount,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async markPaid(id: string) {
		try {
			await APIInstance.post(`/orders/${id}/payment-completed`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async getOrderDetails(id: string) {
		const { data } = await APIInstance.post(`/orders/${id}`);
		return data.order as OrderDetails;
	}
}
