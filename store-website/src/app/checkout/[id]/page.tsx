import { details } from '@/helpers/checkoutHelper';
import { Box, Heading, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import CheckoutForm from './_components/checkoutForm';

export const metadata = {
	title: 'Checkout • Keeth',
};

export default async function Checkout() {
	const _details = await details();

	if (!_details) {
		return redirect('/cart');
	}

	return (
		<Box pt={'100px'} px={'5%'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					Billing Details
				</Text>
			</Heading>

			<CheckoutForm amount={_details.amount} />
		</Box>
	);
}
