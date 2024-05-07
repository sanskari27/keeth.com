import { RemoveFromCart } from '@/components/products/buttons';
import { fetchCart } from '@/helpers/cartHelper';
import { details } from '@/helpers/checkoutHelper';
import { SERVER_URL } from '@/lib/const';
import { Box, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from './_component/checkout';
import PromoCode from './_component/promoCode';

export const revalidate = 0;

export const metadata = {
	title: 'My Cart • Keeth',
};

export default async function Cart() {
	const { items: list, summary: _summary } = await fetchCart();
	const _details = await details();

	const summary = {
		total: _details ? _details.amount : _summary.total,
		discount: _details ? _details.discount : _summary.discount,
		gross: _details ? _details.gross_amount : _summary.gross,
		quantity: _summary.quantity,
	};

	return (
		<Box pt={'100px'} px={'5%'} minHeight={'100vh'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					My Cart
				</Text>
			</Heading>

			<Flex width={'full'} className='flex-col md:flex-row'>
				<Box className='my-6 w-full'>
					<VStack width={'full'} alignItems={'flex-start'}>
						{list.map((item) => (
							<Flex className='w-full flex-col md:flex-row gap-3 border-b py-4 !border-black/40 '>
								<Link
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
								</Link>
								<Flex
									overflow={'hidden'}
									position={'relative'}
									direction={'column'}
									justifyContent={'space-around'}
								>
									<Link
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
									</Link>
									<Flex className='flex-col md:flex-row gap-3 w-full  md:w-[400px]'>
										<Flex className='gap-3'>
											<RemoveFromCart id={item.productId} />
										</Flex>
									</Flex>
								</Flex>
							</Flex>
						))}

						{list.length === 0 && (
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
					<PromoCode />

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
						<CheckoutButton />
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
}
