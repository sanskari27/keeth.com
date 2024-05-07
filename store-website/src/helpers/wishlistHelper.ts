import api from '@/lib/api';
import { cookies } from 'next/headers';

export async function fetchWishlist() {
	try {
		const { data } = await api.get('/wishlist', {
			headers: {
				Cookie: cookies().toString(),
			},
		});

		return data.wishlist as {
			productId: string;
			productCode: string;
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
