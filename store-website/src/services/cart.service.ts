import api from '@/lib/api';

export async function fetchCart() {
	try {
		const { data } = await api.get('/cart');

		const items = data.cart as {
			productId: string;
			productCode: string;
			name: string;
			description: string;
			details: string;
			price: number;
			size: string | null;
			metal_type: string;
			metal_quality: string;
			metal_color: string;
			diamond_type: string | null;
			discount: number;
			quantity: number;
			image: string | null;
		}[];

		const summary = data.summary as {
			total: number;
			discount: number;
			gross: number;
			quantity: number;
		};
		return {
			items,
			summary,
		};
	} catch (err) {
		return {
			items: [],
			summary: {
				total: 0,
				discount: 0,
				gross: 0,
				quantity: 0,
			},
		};
	}
}

export async function addToCart(id: string) {
	try {
		await api.post(`/cart/${id}`);
	} catch (err) {}
}

export async function removeFromCart(id: string) {
	try {
		await api.delete(`/cart/${id}`);
		return true;
	} catch (err) {
		return false;
	}
}
