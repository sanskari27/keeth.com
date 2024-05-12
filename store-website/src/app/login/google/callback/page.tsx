'use client';
import { googleLogin } from '@/services/session.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
	searchParams: { code: string };
};
export default function GoogleLogin({ searchParams: { code } }: Props) {
	const router = useRouter();
	useEffect(() => {
		if (code) {
			googleLogin(code).then((success) => {
				if (success) {
					router.replace('/');
				} else {
					router.replace('/login');
				}
			});
		} else {
			router.replace('/login');
		}
	}, [code, router]);

	return <></>;
}
