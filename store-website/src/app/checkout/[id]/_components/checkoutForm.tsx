'use client';
import { billingDetails, initiatePaymentProvider } from '@/services/checkout.service';
import {
	Button,
	Grid,
	GridItem,
	Input,
	Radio,
	RadioGroup,
	Stack,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { BsCashStack } from 'react-icons/bs';
import { FaRegCreditCard } from 'react-icons/fa';

export default function CheckoutForm({ amount }: { amount: number | string }) {
	const router = useRouter();
	const toast = useToast();
	const [loading, setLoading] = useState(false);

	const handleProceedToCheckout = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		const formData = new FormData(event.currentTarget);
		const success = await billingDetails({
			email: formData.get('email') as string,
			phone: formData.get('phone') as string,
			name: formData.get('name') as string,
			address_line_1: formData.get('address_line_1') as string,
			street: formData.get('street') as string,
			city: formData.get('city') as string,
			state: formData.get('state') as string,
			country: formData.get('country') as string,
			postal_code: formData.get('postal_code') as string,
			payment_method: formData.get('payment_method') as 'cod' | 'prepaid',
		});
		if (!success) {
			setLoading(false);
			return toast({
				status: 'error',
				title: 'Something went wrong.',
				description: 'Please try again later',
				position: 'top',
			});
		}
		const data = await initiatePaymentProvider();

		if (!data) {
			setLoading(false);
			return toast({
				status: 'error',
				title: 'Something went wrong.',
				description: 'Please try again later',
				position: 'top',
			});
		}
		if (data.redirect) {
			router.push(data.link);
		} else {
			router.push('/orders');
		}
	};

	return (
		<form className='my-12 gap-3 mx-3' onSubmit={handleProceedToCheckout}>
			<Text fontSize={'1.3rem'} className='mt-6 -ml-3'>
				Personal Info
			</Text>
			<Grid width={'full'} className='grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
				<GridItem>
					<Text>Name</Text>
					<Input name='name' placeholder='full name' required />
				</GridItem>
				<GridItem>
					<Text>Phone</Text>
					<Input name='phone' placeholder='phone number' required />
				</GridItem>
				<GridItem colSpan={2}>
					<Text>Email</Text>
					<Input name='email' placeholder='email' required />
				</GridItem>
			</Grid>
			<Text fontSize={'1.3rem'} className='mt-6 -ml-3'>
				Address Info
			</Text>
			<Grid width={'full'} className='grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 '>
				<GridItem>
					<Text>House N/o</Text>
					<Input name='address_line_1' placeholder='House N/o' required />
				</GridItem>
				<GridItem>
					<Text>Street</Text>
					<Input name='street' placeholder='Street' required />
				</GridItem>
				<GridItem>
					<Text>City</Text>
					<Input name='city' placeholder='City' required />
				</GridItem>
				<GridItem>
					<Text>State</Text>
					<Input name='state' placeholder='State ' required />
				</GridItem>
				<GridItem>
					<Text>Country</Text>
					<Input name='country' placeholder='Country' required />
				</GridItem>
				<GridItem>
					<Text>Postal Code</Text>
					<Input name='postal_code' placeholder='Postal Code ' required />
				</GridItem>
			</Grid>

			<Text fontSize={'1.3rem'} className='mt-6 -ml-3'>
				Payment Method
			</Text>
			<RadioGroup name='payment_method'>
				<Stack
					direction='row'
					borderWidth={'1px'}
					borderColor={'grey.400'}
					paddingY={'0.5rem'}
					paddingX={'1.5rem'}
					rounded={'2xl'}
					width={'fit-content'}
					gap={'2rem'}
				>
					<Radio value='cod'>
						<Stack direction='row' alignItems={'center'} gap={'0.75rem'} marginLeft={'0.5rem'}>
							<BsCashStack />
							<Text>Cash on Delivery</Text>
						</Stack>
					</Radio>
					<Radio value='prepaid'>
						<Stack direction='row' alignItems={'center'} gap={'0.75rem'} marginLeft={'0.5rem'}>
							<FaRegCreditCard />
							<Text>Pay Now</Text>
						</Stack>
					</Radio>
				</Stack>
			</RadioGroup>

			<Button
				marginTop={'3rem'}
				width={'50%'}
				type='submit'
				marginX={'25%'}
				bgColor={'#DB3E42'}
				_hover={{
					bgColor: '#BA3B3E',
				}}
				color='white'
				isLoading={loading}
			>
				Checkout {amount ? `@ ₹${amount}` : ''}
			</Button>
		</form>
	);
}
