'use client';
import { addCoupon, removeCoupon, startCheckout } from '@/services/checkout.service';
import { CircularProgress, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { DM_Mono } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

export default function PromoCode() {
	const [promoCode, setPromoCode] = useState('');
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const router = useRouter();

	const handleAddCoupon = async () => {
		setLoading(true);
		const id = await startCheckout();
		if (!id) {
			setLoading(false);
			return toast({
				status: 'error',
				position: 'top',
				title: 'Something went wrong.',
				description: 'Please try again later.',
			});
		}
		const success = await addCoupon(promoCode);
		setLoading(false);
		if (success) {
			router.refresh();
		} else {
			setPromoCode('');
			return toast({
				status: 'error',
				position: 'top',
				title: 'Invalid Promo Code.',
			});
		}
	};

	const handleRemoveCoupon = async () => {
		setLoading(true);
		const success = await removeCoupon();
		setPromoCode('');
		setLoading(false);
		if (success) {
			router.refresh();
		}
	};

	return (
		<Flex
			width={'full'}
			justifyContent={'space-between'}
			alignItems={'center'}
			bgColor={'#F4F4F4'}
			rounded={'lg'}
			paddingY={'0.75rem'}
			paddingLeft={'1.5rem'}
			paddingRight={'0.5rem'}
		>
			<Text>Promocode</Text>
			<Input
				width={'55%'}
				variant='outline'
				textAlign={'center'}
				placeholder={`ENTER CODE`}
				className={dm_mono.className + ' '}
				value={promoCode}
				onChange={(e) => setPromoCode(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddCoupon();
					}
				}}
			/>
			{loading ? (
				<>
					<CircularProgress isIndeterminate color='#7E3625' size={'1.5rem'} />
				</>
			) : promoCode.length ? (
				<IoCloseCircle color='red' fontSize={'1.5rem'} onClick={handleRemoveCoupon} />
			) : null}
		</Flex>
	);
}
