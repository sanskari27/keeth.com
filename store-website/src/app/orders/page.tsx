import { fetchOrders } from '@/helpers/checkoutHelper';
import verifyAuth from '@/helpers/verifyAuth';
import { SERVER_URL } from '@/lib/const';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import Buttons from './_component/buttons';

export const metadata = {
	title: 'My Orders • Keeth',
};

export default async function Orders() {
	await verifyAuth({
		fallbackUrl: '/login?referrer=orders',
	});

	const list = await fetchOrders();

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
								<Buttons {...item} />
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
											className=' w-full rounded-2xl object-cover mix-blend-multiply object-center '
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

					{list.length === 0 && (
						<Box paddingY={'2rem'} className='w-full'>
							<Link href={'/products'} className='w-full'>
								<Text fontWeight={'medium'} fontSize={'xl'} textAlign={'center'}>
									No order history. click here to explore
								</Text>
							</Link>
						</Box>
					)}
				</VStack>
			</Box>
		</Box>
	);
}
