import { Resend } from 'resend';
import { RESEND_API_KEY } from '../../config/const';

const resend = new Resend(RESEND_API_KEY);

export async function sendSimpleText(to: string, value: string) {
	const { error } = await resend.emails.send({
		from: 'Feedbacks <no-reply@keethjewels.com>',
		to: [to],
		subject: 'New Feedback @ keethjewels.com',
		html: `<p>${value}</p>`,
	});

	if (error) {
		console.log(error);

		return false;
	}
	return true;
}
