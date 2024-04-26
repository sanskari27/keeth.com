import APIInstance from '../config/APIInstance';
import { Cart } from '../views/pages/abandoned-carts';
import { Order } from '../views/pages/orders';

export default class CartService {
	static async abandonedCarts() {
		try {
			const { data } = await APIInstance.get(`/cart/abandoned-carts`);
			return data.carts as Cart[];
		} catch (err) {
			return [];
		}
	}

	static async getOrders() {
		try {
			const { data } = await APIInstance.get(`/checkout/orders`);
			return data.orders as Order[];
		} catch (err) {
			return [];
		}
	}
}
