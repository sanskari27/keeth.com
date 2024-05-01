'use client';
import { RemoveFromCart } from '@/components/products/buttons';
import useAuth from '@/hooks/useAuth';
import { SERVER_URL } from '@/lib/const';
import { fetchCart } from '@/services/cart.service';
import { addCoupon, details, removeCoupon, startCheckout } from '@/services/checkout.service';
import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Input,
	Text,
	VStack,
	useToast,
} from '@chakra-ui/react';
import { DM_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

export default function Cart() {
	useAuth({
		fallbackUrl: '/login?referrer=wishlist',
	});
	const toast = useToast();
	const router = useRouter();

	const [list, setList] = useState<
		{
			productId: string;
			productCode: string;
			name: string;
			description: string;
			details: string;
			price: number;
			size: string | null;
			metal_type: string;
			metal_quality: string;
			metal_color: string;
			diamond_type: string | null;
			discount: number;
			quantity: number;
			image: string | null;
		}[]
	>([]);

	const [loading, setLoading] = useState(true);
	const [promoCode, setPromoCode] = useState('');
	const [transaction_id, setTransactionId] = useState<string | null>(null);
	const [summary, setSummary] = useState({
		total: 0,
		discount: 0,
		quantity: 0,
		gross: 0,
	});

	const fetchData = useCallback(() => {
		fetchCart()
			.then(({ items, summary }) => {
				setList(items);
				setSummary(summary);
			})
			.finally(() => setLoading(false));
		setTransactionId(null);
	}, []);

	const handleProceedToCheckout = async () => {
		let id: string | null = transaction_id;
		if (!id) {
			id = await startCheckout();
			if (!id) {
				return toast({
					status: 'error',
					position: 'top',
					title: 'Something went wrong.',
					description: 'Please try again later.',
				});
			}
			setTransactionId(id);
		}

		router.push(`/checkout/${id}`);
	};

	const handleAddCoupon = async () => {
		let id: string | null = transaction_id;
		if (!id) {
			id = await startCheckout();
			if (!id) {
				return toast({
					status: 'error',
					position: 'top',
					title: 'Something went wrong.',
					description: 'Please try again later.',
				});
			}
			setTransactionId(id);
		}
		const success = await addCoupon(id, promoCode);
		if (success) {
			details(id).then((data) => {
				if (!data) return;
				setSummary((prev) => ({
					...prev,
					discount: data.discount,
					gross: data.gross_amount,
					total: data.amount,
				}));
			});
		}
	};

	const handleRemoveCoupon = async () => {
		if (!transaction_id) return;

		setPromoCode('');

		const success = await removeCoupon(transaction_id);
		if (success) {
			details(transaction_id).then((data) => {
				if (!data) return;
				setSummary((prev) => ({
					...prev,
					discount: data.discount,
					gross: data.gross_amount,
					total: data.amount,
				}));
			});
		}
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<Box pt={'100px'} px={'5%'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					My Cart
				</Text>
			</Heading>

			<Flex width={'full'} className='flex-col md:flex-row'>
				<Box className='my-6 w-full'>
					<VStack width={'full'} alignItems={'flex-start'}>
						{list.map((item) => (
							<Link
								className='w-full'
								key={item.productId}
								href={{
									pathname: `/products/${item.productCode}`,
									query: {
										metal_color: item.metal_color,
										metal_quality: item.metal_quality,
										diamond_type: item.diamond_type,
										size: item.size,
									},
								}}
							>
								<Flex className='w-full gap-3 border-b py-4 !border-black/40 '>
									<Box
										rounded={'2xl'}
										overflow={'hidden'}
										w='250px'
										aspectRatio={1 / 1}
										position={'relative'}
									>
										<Image
											src={SERVER_URL + `/media/${item.image}`}
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
												{item.name}
											</Text>
											<Text textColor={'#8E8E8E'}>Product Code: {item.productCode}</Text>
											<Text textColor={'#8E8E8E'}>Description: {item.description}</Text>
											<Text textColor={'#8E8E8E'}>
												Price: ₹ {(item.price - item.discount).toLocaleString()}
											</Text>
											<Text textColor={'#8E8E8E'}>Quantity: {item.quantity}</Text>
											<Text textColor={'#8E8E8E'} marginTop={'0.5rem'}>
												Metal Details: Color : {item.metal_color}, Quality: {item.metal_quality}
											</Text>
											<Text hidden={!item.diamond_type} textColor={'#8E8E8E'}>
												Diamond Details: {item.diamond_type}
											</Text>
											<Text hidden={!item.size} textColor={'#8E8E8E'}>
												Size: {item.size}
											</Text>
										</Box>
										<Flex className='flex-col md:flex-row gap-3 w-full  md:w-[400px]'>
											<Flex className='gap-3'>
												<RemoveFromCart id={item.productId} onRemove={fetchData} />
											</Flex>
										</Flex>
									</Flex>
								</Flex>
							</Link>
						))}

						{list.length === 0 && !loading && (
							<Box paddingY={'2rem'} className='w-full'>
								<Link href={'/products'} className='w-full'>
									<Text fontWeight={'medium'} fontSize={'xl'} textAlign={'center'}>
										Cart is empty. click here to explore
									</Text>
								</Link>
							</Box>
						)}
					</VStack>
				</Box>
				<Box
					className='w-full md:w-[550px] md:border-l !border-black/40 px-4'
					hidden={list.length === 0}
				>
					<Text fontWeight={'medium'} fontSize={'xl'}>
						Order Summary
					</Text>
					<Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
						<Text>Total </Text>
						<Text>{`${summary.quantity} Items`}</Text>
					</Flex>
					<Divider className='border !border-black/40 border-dashed my-4' />
					<Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
						<Text>Gross Amount</Text>
						<Text>₹ {summary.gross.toLocaleString()}</Text>
					</Flex>
					<Divider className='border !border-black/40 border-dashed my-4' />
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
						{promoCode.length ? (
							<IoCloseCircle color='red' fontSize={'1.5rem'} onClick={handleRemoveCoupon} />
						) : null}
					</Flex>

					<Divider className='border !border-black/40 border-dashed my-4' />
					<Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
						<Text>Total Discount</Text>
						<Text>₹ {summary.discount.toLocaleString()}</Text>
					</Flex>
					<Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
						<Text>Total Amount</Text>
						<Text>₹ {summary.total.toLocaleString()}</Text>
					</Flex>
					<Divider className='border !border-black/40 border-dashed my-4' />
					<Flex
						width={'full'}
						justifyContent={'space-between'}
						alignItems={'center'}
						className='mb-4'
					>
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
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
}
