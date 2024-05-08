import Logger from 'n23-logger';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '../../config/const';
import {
	OrderCancelledTemplate,
	OrderConfirmationTemplate,
	OrderDeliveredTemplate,
	OrderShippedTemplate,
	WelcomeEmailTemplate,
} from './templates';

const resend = new Resend(RESEND_API_KEY);

export async function sendSimpleText(to: string, value: string) {
	const { error } = await resend.emails.send({
		from: 'Feedbacks <no-reply@keethjewels.com>',
		to: [to],
		subject: 'New Feedback @ keethjewels.com',
		html: `<p>${value}</p>`,
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending feedback message' });
		return false;
	}
	return true;
}

export async function sendWelcomeEmail(to: string) {
	const { error } = await resend.emails.send({
		from: 'Keeth <info@keethjewels.com>',
		to: [to],
		subject: 'Welcome to Keeth Jewels!',
		html: WelcomeEmailTemplate(to),
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending feedback message' });
		return false;
	}
	return true;
}

export async function sendOrderConfirmation(
	to: string,
	details: {
		status: 'placed' | 'shipped' | 'delivered' | 'cancelled';
		customer: { name: string; phone: string; email: string };
		address: {
			address_line_1: string;
			street: string;
			city: string;
			state: string;
			country: string;
			pincode: string;
		};
		order_details: {
			order_id: string;
			order_date: string;
			payment_method: string;
			gross_amount: number;
			discount: number;
			total_amount: number;
			tracking_link: string;
		};
		products: {
			image: string;
			name: string;
			metal_color: string;
			metal_purity: string;
			size: string;
			diamond_quality: string;
			quantity: number;
			price: number;
		}[];
	}
) {
	const { error } = await resend.emails.send({
		from: 'Keeth <info@keethjewels.com>',
		to: [to],
		subject:
			details.status === 'placed'
				? 'Order Confirmation from Keeth Jewels'
				: details.status === 'shipped'
				? 'Order is on Its Way - Exciting News from Keeth Jewels!'
				: details.status === 'delivered'
				? `Your Order Has Arrived! We'd Love to Hear Your Thoughts!`
				: 'Order Cancelled!',
		html:
			details.status === 'placed'
				? OrderConfirmationTemplate(details)
				: details.status === 'shipped'
				? OrderShippedTemplate(details)
				: details.status === 'delivered'
				? OrderDeliveredTemplate(details)
				: OrderCancelledTemplate(details),
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending feedback message' });
		return false;
	}
	return true;
}
