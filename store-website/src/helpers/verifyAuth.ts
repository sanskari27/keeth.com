import { redirect } from 'next/navigation';
import { isLoggedIn } from './authHelper';

export default async function verifyAuth({
	redirectUrl = '',
	fallbackUrl = '',
}: {
	redirectUrl?: string;
	fallbackUrl?: string;
} = {}) {
	const isAuthenticated = await isLoggedIn();

	if (isAuthenticated && redirectUrl) {
		redirect(redirectUrl);
	}
	if (!isAuthenticated && fallbackUrl) {
		redirect(fallbackUrl);
	}
}
