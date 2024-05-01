'use client';
import { billingDetails, details, initiatePaymentProvider } from '@/services/checkout.service';
import { Box, Button, Grid, GridItem, Heading, Input, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function Checkout({
	params: { id },
	searchParams,
}: {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const router = useRouter();
	const toast = useToast();
	const [amount, setAmount] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		details(id).then((details) => {
			if (!details) {
				return router.replace('/cart');
			}
			setAmount(details.amount);
		});
	}, [id]);

	const handleProceedToCheckout = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		const formData = new FormData(event.currentTarget);
		const success = await billingDetails(id, {
			email: formData.get('email') as string,
			phone: formData.get('phone') as string,
			name: formData.get('name') as string,
			address_line_1: formData.get('address_line_1') as string,
			street: formData.get('street') as string,
			city: formData.get('city') as string,
			state: formData.get('state') as string,
			country: formData.get('country') as string,
			postal_code: formData.get('postal_code') as string,
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
		const link = await initiatePaymentProvider(id);

		if (!link) {
			setLoading(false);
			return toast({
				status: 'error',
				title: 'Something went wrong.',
				description: 'Please try again later',
				position: 'top',
			});
		}

		router.push(link);
	};

	return (
		<Box pt={'100px'} px={'5%'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					Billing Details
				</Text>
			</Heading>

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
		</Box>
	);
}
