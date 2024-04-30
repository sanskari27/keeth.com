import api from '@/lib/api';

export async function fetchWishlist() {
	try {
		const { data } = await api.post('/wishlist');

		return data.wishlist as {
			productId: string;
			name: string;
			description: string;
			price: number;
			discount: number;
			image: string | null;
		}[];
	} catch (err) {
		return [];
	}
}
