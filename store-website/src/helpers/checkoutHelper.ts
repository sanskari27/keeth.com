import api from '@/lib/api';
import { cookies } from 'next/headers';

export async function details() {
	try {
		const { data } = await api.get(`/checkout`, {
			headers: {
				Cookie: cookies().toString(),
			},
		});
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

export async function fetchOrders() {
	try {
		const { data } = await api.get(`/orders/my-orders`, {
			headers: {
				Cookie: cookies().toString(),
			},
		});
		return data.orders as {
			id: string;
			amount: number;
			status: 'success' | 'failed' | 'pending' | 'cancelled';
			transaction_date: string;
			order_status:
				| 'uninitialized'
				| 'placed'
				| 'cancelled'
				| 'shipped'
				| 'delivered'
				| 'return-raised'
				| 'return-accepted'
				| 'return-denied'
				| 'return-initiated'
				| 'refund-initiated'
				| 'return-completed';
			tracking_number: string;
			return_tracking_number: string;
			payment_method: 'cod' | 'prepaid';
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
