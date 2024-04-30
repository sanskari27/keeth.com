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
			discount: number;
			quantity: number;
			image: string | null;
		}[];

		const total = data.total as number;
		return {
			items,
			total,
		};
	} catch (err) {
		return {
			items: [],
			total: 0,
		};
	}
}

export async function addToCart(id: string) {
	try {
		await api.post(`/cart/${id}`);
	} catch (err) {}
}
