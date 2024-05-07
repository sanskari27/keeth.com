'use client';
import { startCheckout } from '@/services/checkout.service';
import { Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function CheckoutButton() {
	const toast = useToast();
	const router = useRouter();

	const handleProceedToCheckout = async () => {
		const id = await startCheckout();
		if (!id) {
			if (!id) {
				return toast({
					status: 'error',
					position: 'top',
					title: 'Something went wrong.',
					description: 'Please try again later.',
				});
			}
		}

		const random = Date.now();

		router.push(`/checkout/order-${random}`);
	};

	return (
		<Button
			width={'full'}
			py='0.75rem'
			bgColor={'#E3BD9E'}
			_hover={{
				bgColor: '#CEA98C',
			}}
			color={'white'}
			onClick={handleProceedToCheckout}
		>
			Proceed to Checkout
		</Button>
	);
}
