'use client';
import useAuth from '@/hooks/useAuth';
import { SERVER_URL } from '@/lib/const';
import {
	cancelOrder,
	cancelReturnRequest,
	fetchOrders,
	initiatePaymentProvider,
	requestReturn,
} from '@/services/checkout.service';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Flex,
	Heading,
	Text,
	VStack,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { HiOutlineArrowUturnLeft } from 'react-icons/hi2';
import { MdOutlinePayment } from 'react-icons/md';

export default function Orders() {
	useAuth({
		fallbackUrl: '/login?referrer=orders',
	});

	const cancellationID = React.useRef<string | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef(null);

	const toast = useToast();
	const router = useRouter();

	const [list, setList] = useState<
		{
			id: string;
			amount: number;
			status: 'success' | 'failed' | 'pending' | 'cancelled';
			transaction_date: string;
			order_status:
				| 'payment-pending'
				| 'placed'
				| 'cancelled'
				| 'shipped'
				| 'delivered'
				| 'return-raised'
				| 'return-accepted'
				| 'return-denied'
				| 'return-initiated'
				| 'refund-initiated'
				| 'return-completed';
			tracking_number: string;
			return_tracking_number: string;
			payment_method: 'cod' | 'prepaid';
			products: {
				product_id: string;
				description: string;
				productCode: string;
				quantity: number;
				name: string;
				price: number;
				discount: number;
				size: string;
				metal_type: string;
				metal_color: string;
				metal_quality: string;
				diamond_type: string;
			}[];
		}[]
	>([]);

	const onOrderCancel = () => {
		onClose();
		if (!cancellationID.current) return;
		handleCancel(cancellationID.current);
	};

	const handleOrderCancelClick = (id: string) => {
		onOpen();
		cancellationID.current = id;
	};

	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(() => {
		fetchOrders()
			.then(setList)
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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

	const handleCancel = async (id: string) => {
		const success = await cancelOrder(id);
		if (!success) {
			return toast({
				status: 'error',
				title: 'Order cancellation failed.',
				description: 'This order cannot be cancelled',
				position: 'top',
			});
		}
		fetchData();
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
		fetchData();
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
		fetchData();
	};

	return (
		<Box pt={'100px'} px={'5%'} minHeight={'100vh'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					My Orders
				</Text>
			</Heading>

			<Box className='my-6 w-full'>
				<VStack width={'full'} alignItems={'flex-start'}>
					{list.map((item, index) => (
						<VStack
							width={'full'}
							alignItems={'flex-start'}
							key={index}
							className='border border-black/40 rounded-2xl px-4'
						>
							<VStack
								className='gap-3 my-4 md:my-4 md:m-4 w-full  md:w-[526px]  border  rounded-2xl p-4'
								alignItems={'flex-start'}
							>
								<Flex
									fontWeight={'medium'}
									textColor={'black'}
									className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4 '
								>
									<Text>Total Amount:</Text>
									<Text>₹ {item.amount}</Text>
								</Flex>
								<Flex
									fontWeight={'medium'}
									textColor={'#8E8E8E'}
									className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4'
								>
									<Text>Total Quantity: </Text>
									<Text>{item.products.reduce((acc, item) => (acc += item.quantity), 0)}</Text>
								</Flex>
								<Flex
									fontWeight={'medium'}
									textColor={'#8E8E8E'}
									className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4'
								>
									<Text>Order Date: </Text>
									<Text>{item.transaction_date}</Text>
								</Flex>
								<Flex
									fontWeight={'medium'}
									textColor={'#8E8E8E'}
									className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4'
								>
									<Text>Payment Status: </Text>
									<Text className='uppercase'>{item.status}</Text>
								</Flex>
								<Flex
									fontWeight={'medium'}
									textColor={'#8E8E8E'}
									className='border-b border-black/20 justify-between w-full  md:w-[500px]  px-4'
								>
									<Text>Order Status: </Text>
									<Text className='uppercase'>{item.order_status.replace('-', ' ')}</Text>
								</Flex>
								{item.order_status === 'payment-pending' ? (
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
										onClick={() => handleOrderCancelClick(item.id)}
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
										leftIcon={<HiOutlineArrowUturnLeft color='white' />}
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
							</VStack>
							{item.products.map((product, index) => (
								<Flex className='w-full gap-3 border-b py-4 !border-black/40 ' key={index}>
									<Box
										rounded={'2xl'}
										overflow={'hidden'}
										w='250px'
										aspectRatio={1 / 1}
										position={'relative'}
									>
										<Image
											src={SERVER_URL + `/products/${product.product_id}/image`}
											alt={'Product Image'}
											width={500}
											height={500}
											className=' w-full rounded-2xl object-cover mix-blend-multiply object-center '
											priority
										/>
									</Box>
									<Flex
										overflow={'hidden'}
										position={'relative'}
										direction={'column'}
										justifyContent={'space-around'}
									>
										<Box>
											<Text fontWeight={'medium'} textColor={'black'}>
												{product.name}
											</Text>
											<Text textColor={'#8E8E8E'}>Product Code: {product.productCode}</Text>
											<Text textColor={'#8E8E8E'}>Description: {product.description}</Text>
											<Text textColor={'#8E8E8E'}>Price: ₹ {product.price - product.discount}</Text>
											<Text textColor={'#8E8E8E'}>Quantity: {product.quantity}</Text>
											<Text textColor={'#8E8E8E'} marginTop={'0.5rem'}>
												Metal Details: Color : {product.metal_color}, Quality:{' '}
												{product.metal_quality}
											</Text>
											<Text hidden={!product.diamond_type} textColor={'#8E8E8E'}>
												Diamond Details: {product.diamond_type}
											</Text>
											<Text hidden={!product.size} textColor={'#8E8E8E'}>
												Size: {product.size}
											</Text>
										</Box>
									</Flex>
								</Flex>
							))}
						</VStack>
					))}

					{list.length === 0 && !loading && (
						<Box paddingY={'2rem'} className='w-full'>
							<Link href={'/products'} className='w-full'>
								<Text fontWeight={'medium'} fontSize={'xl'} textAlign={'center'}>
									No order history found. click here to explore
								</Text>
							</Link>
						</Box>
					)}
				</VStack>
			</Box>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Cancel Order
						</AlertDialogHeader>

						<AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme='red' onClick={onOrderCancel} ml={3}>
								Cancel
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box>
	);
}
