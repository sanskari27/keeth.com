'use client';
import { googleLogin } from '@/services/session.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
	params: { code: string };
};
export default async function GoogleLogin({ params: { code } }: Props) {
	const router = useRouter();
	useEffect(() => {
		if (code) {
			googleLogin(code).then(() => {
				router.replace('/');
			});
		} else {
			router.replace('/');
		}
	}, [code, router]);

	return <></>;
}
