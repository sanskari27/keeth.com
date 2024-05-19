import Logger from 'n23-logger';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '../../config/const';
import {
	OrderCancelledTemplate,
	OrderConfirmationTemplate,
	OrderDeliveredTemplate,
	OrderShippedTemplate,
	PasswordResetTemplate,
	ReturnAcceptedTemplate,
	ReturnCompletedTemplate,
	ReturnDeniedTemplate,
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
		Logger.error('Resend Error', error, { details: 'Error Sending welcome message' });
		return false;
	}
	return true;
}

export async function sendPasswordResetEmail(to: string, token: string) {
	const { error } = await resend.emails.send({
		from: 'Keeth <info@keethjewels.com>',
		to: [to],
		subject: 'Password reset request for Keeth Jewels',
		html: PasswordResetTemplate(token),
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending reset message' });
		return false;
	}
	return true;
}

export async function sendOrderConfirmation(
	to: string,
	details: {
		status:
			| 'placed'
			| 'shipped'
			| 'delivered'
			| 'cancelled'
			| 'return-denied'
			| 'return-accepted'
			| 'return-completed';
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
				: details.status === 'return-denied'
				? `Return Request Denied!`
				: details.status === 'return-accepted'
				? `Return Request Approved!`
				: details.status === 'return-completed'
				? `Return Completed. You have been refunded!`
				: 'Order Cancelled!',
		html:
			details.status === 'placed'
				? OrderConfirmationTemplate(details)
				: details.status === 'shipped'
				? OrderShippedTemplate(details)
				: details.status === 'delivered'
				? OrderDeliveredTemplate(details)
				: details.status === 'return-denied'
				? ReturnDeniedTemplate(details)
				: details.status === 'return-accepted'
				? ReturnAcceptedTemplate(details)
				: details.status === 'return-completed'
				? ReturnCompletedTemplate(details)
				: OrderCancelledTemplate(details),
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending order message' });
		return false;
	}
	return true;
}
