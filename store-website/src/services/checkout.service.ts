import api from '@/lib/api';

export async function startCheckout() {
	try {
		const { data } = await api.post('/checkout/start-checkout');
		return data.transaction_id as string;
	} catch (err) {
		return null;
	}
}

export async function details(id: string) {
	try {
		const { data } = await api.get(`/checkout/${id}`);
		return data.transaction as {
			id: any;
			amount: number;
			gross_amount: number;
			discount: number;
			status: 'success' | 'failed' | 'pending' | 'cancelled';
			transaction_date: string;
			products: {
				product_id: string;
				productCode: string;
				quantity: number;
				name: string;
				price: number;
				discount: number;
				size: string;
				metal_type: string;
				metal_color: string;
				metal_quality: string;
				diamond_type: string;
			}[];
		};
	} catch (err) {
		return null;
	}
}

export async function addCoupon(id: string, coupon: string) {
	try {
		await api.post(`/checkout/${id}/coupon`, {
			coupon,
		});
		return true;
	} catch (err) {
		return false;
	}
}

export async function removeCoupon(id: string) {
	try {
		await api.delete(`/checkout/${id}/coupon`);
		return true;
	} catch (err) {
		return false;
	}
}

export async function billingDetails(
	id: string,
	details: {
		email: string;
		phone: string;
		name: string;
		address_line_1: string;
		address_line_2?: string;
		address_line_3?: string;
		street: string;
		city: string;
		state: string;
		country: string;
		postal_code: string;
	}
) {
	try {
		await api.post(`/checkout/${id}/billing-details`, details);
		return true;
	} catch (err) {
		return false;
	}
}

export async function initiatePaymentProvider(id: string) {
	try {
		const { data } = await api.post(`/checkout/${id}/initiate-payment-provider`);
		return data.payment_link as string;
	} catch (err) {
		return null;
	}
}

export async function fetchOrders() {
	try {
		const { data } = await api.get(`/checkout/my-orders`);
		return data.orders as {
			id: string;
			amount: number;
			status: 'success' | 'failed' | 'pending' | 'cancelled';
			transaction_date: string;
			products: {
				product_id: string;
				productCode: string;
				quantity: number;
				name: string;
				description: string;
				price: number;
				discount: number;
				size: string;
				metal_type: string;
				metal_color: string;
				metal_quality: string;
				diamond_type: string;
			}[];
		}[];
	} catch (err) {
		return [];
	}
}
