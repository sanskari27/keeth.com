'use client';
import {
	cancelReturnRequest,
	initiatePaymentProvider,
	requestReturn,
} from '@/services/checkout.service';
import { Button, Flex, Icon, Text, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { MdOutlinePayment } from 'react-icons/md';
import { TbPackageOff } from 'react-icons/tb';
import AlertBox, { AlertBoxHandle } from './alertBox';

export default function Buttons(item: {
	id: string;
	order_status: string;
	tracking_number: string;
	return_tracking_number: string;
}) {
	const router = useRouter();
	const toast = useToast();
	const ref = useRef<AlertBoxHandle>(null);

	const handleRetryPayment = async (id: string) => {
		const pay_link = await initiatePaymentProvider(id);
		if (!pay_link) {
			return toast({
				status: 'error',
				title: 'Something went wrong.',
				description: 'Please try again later',
				position: 'top',
			});
		}
		if (pay_link.redirect) {
			router.push(pay_link.link);
		} else {
			router.push('/orders');
		}
	};

	const handleRequestReturn = async (id: string) => {
		const success = await requestReturn(id);
		if (!success) {
			return toast({
				status: 'error',
				title: 'Items cannot be returned now.',
				description: 'You can only return items with delivery status DELIVERED.',
				position: 'top',
			});
		}
		router.refresh();
	};

	const handleCancelReturnRequest = async (id: string) => {
		const success = await cancelReturnRequest(id);
		if (!success) {
			return toast({
				status: 'error',
				title: 'Return request cannot be cancelled now.',
				description: 'You can only cancel return request if order status is RETURN RAISED',
				position: 'top',
			});
		}
		router.refresh();
	};

	return (
		<>
			{item.order_status === 'uninitialized' ? (
				<Button
					color={'white'}
					bgColor={'#CEA98C'}
					_hover={{
						bgColor: '#BC9C83',
					}}
					variant={'outline'}
					py='0.5rem'
					px='4rem'
					rounded={'xl'}
					className='justify-between w-full  md:w-[500px]  px-4'
					onClick={() => handleRetryPayment(item.id)}
					leftIcon={<MdOutlinePayment color='white' />}
				>
					<Text fontWeight={'medium'}>Retry Payment</Text>
				</Button>
			) : item.order_status === 'cancelled' ? (
				<Button
					borderColor={'#891618'}
					color={'#891618'}
					variant={'outline'}
					py='0.5rem'
					px='4rem'
					rounded={'xl'}
					className='justify-between w-full  md:w-[500px]  px-4'
					leftIcon={<FaShippingFast color='#891618' />}
				>
					<Text fontWeight={'medium'}>Order Cancelled</Text>
				</Button>
			) : item.order_status === 'placed' ? (
				<Button
					borderColor={'#891618'}
					color={'#891618'}
					variant={'outline'}
					py='0.5rem'
					px='4rem'
					rounded={'xl'}
					className='justify-between w-full  md:w-[500px]  px-4'
					onClick={() => ref.current?.open(item.id)}
					leftIcon={<FcCancel color='#891618' />}
				>
					<Text fontWeight={'medium'}>Cancel Order</Text>
				</Button>
			) : item.order_status === 'shipped' ? (
				<>
					<Flex
						fontWeight={'medium'}
						textColor={'#8E8E8E'}
						className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4'
					>
						<Text>Tracking No.: </Text>
						<Text className='uppercase'>{item.tracking_number}</Text>
					</Flex>
					<Link href={'https://bluedart.com/tracking'} target='_blank'>
						<Button
							borderColor={'green'}
							color={'green'}
							variant={'outline'}
							py='0.5rem'
							px='4rem'
							rounded={'xl'}
							className='justify-between w-full  md:w-[500px]  px-4'
							leftIcon={<FaShippingFast color='green' />}
						>
							<Text fontWeight={'medium'}>Track Order</Text>
						</Button>
					</Link>
				</>
			) : item.order_status === 'delivered' ? (
				<Button
					colorScheme={'blue'}
					color={'white'}
					variant={'solid'}
					py='0.5rem'
					px='4rem'
					rounded={'xl'}
					className='justify-between w-full  md:w-[500px]  px-4'
					onClick={() => handleRequestReturn(item.id)}
					leftIcon={<Icon as={TbPackageOff} fontSize={'1.3rem'} color={'white'} />}
				>
					<Text fontWeight={'medium'}>Request Return</Text>
				</Button>
			) : item.order_status === 'return-raised' ? (
				<Button
					borderColor={'#891618'}
					color={'#891618'}
					variant={'outline'}
					py='0.5rem'
					px='4rem'
					rounded={'xl'}
					className='justify-between w-full  md:w-[500px]  px-4'
					onClick={() => handleCancelReturnRequest(item.id)}
					leftIcon={<FcCancel color='#891618' />}
				>
					<Text fontWeight={'medium'}>Cancel Return</Text>
				</Button>
			) : item.order_status === 'return-initiated' ? (
				<>
					<Flex
						fontWeight={'medium'}
						textColor={'#8E8E8E'}
						className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4'
					>
						<Text>Tracking No.: </Text>
						<Text className='uppercase'>{item.return_tracking_number}</Text>
					</Flex>
					<Link href={'https://bluedart.com/tracking'} target='_blank'>
						<Button
							borderColor={'green'}
							color={'green'}
							variant={'outline'}
							py='0.5rem'
							px='4rem'
							rounded={'xl'}
							className='justify-between w-full  md:w-[500px]  px-4'
							leftIcon={<FaShippingFast color='green' />}
						>
							<Text fontWeight={'medium'}>Track Return</Text>
						</Button>
					</Link>
				</>
			) : (
				<Button
					borderColor={'green'}
					color={'green'}
					variant={'outline'}
					py='0.5rem'
					px='4rem'
					rounded={'xl'}
					className='justify-between w-full  md:w-[500px]  px-4'
					leftIcon={<FaShippingFast color='green' />}
				>
					<Text fontWeight={'medium'} className='capitalize'>
						{item.order_status.replace('-', ' ')}
					</Text>
				</Button>
			)}
			<AlertBox ref={ref} />
		</>
	);
}
