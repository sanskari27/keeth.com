'use client';
import { isLoggedIn } from '@/services/session.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useAuth({
	redirectUrl = '',
	fallbackUrl = '',
}: {
	redirectUrl?: string;
	fallbackUrl?: string;
} = {}) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		setLoading(true);
		isLoggedIn()
			.then((isAuthenticated) => {
				setAuthenticated(isAuthenticated);
				if (isAuthenticated && redirectUrl) {
					router.push(redirectUrl);
				}
				if (!isAuthenticated && fallbackUrl) {
					router.push(fallbackUrl);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const refresh = ()=>{
		setLoading(true);
		isLoggedIn()
			.then((isAuthenticated) => {
				setAuthenticated(isAuthenticated);
				if (isAuthenticated && redirectUrl) {
					router.push(redirectUrl);
				}
				if (!isAuthenticated && fallbackUrl) {
					router.push(fallbackUrl);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return {
		loading,
		isAuthenticated,
		refresh,
	};
}
