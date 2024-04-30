import api from '@/lib/api';

export async function startCheckout() {
	try {
		const { data } = await api.post('/checkout/start-checkout');
		return data.transaction_id as string;
	} catch (err) {
		return null;
	}
}

export async function addCoupon(id: string) {
	try {
		await api.post(`/checkout/${id}/coupon`);
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
		address_line_2: string;
		address_line_3: string;
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
