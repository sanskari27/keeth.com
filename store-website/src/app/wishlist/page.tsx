import { AddToCart, WishlistButton } from '@/components/products/buttons';
import verifyAuth from '@/helpers/verifyAuth';
import { fetchWishlist } from '@/helpers/wishlistHelper';
import { SERVER_URL } from '@/lib/const';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Wishlist • Keeth',
};

export const revalidate = 0;

export default async function Wishlist() {
	await verifyAuth({
		fallbackUrl: '/login?referrer=wishlist',
	});

	const list = await fetchWishlist();

	return (
		<Box pt={'100px'} px={'5%'} minHeight={'100vh'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					My Wishlist
				</Text>
			</Heading>

			<Box className='my-6 '>
				<VStack width={'full'} alignItems={'flex-start'}>
					{list.map((item) => (
						<Flex className='gap-3 flex-col md:flex-row' key={item.productId}>
							<Link
								href={{
									pathname: `/products/${item.productCode}`,
									query: {
										productId: item.productId,
									},
								}}
							>
								<Box
									rounded={'2xl'}
									overflow={'hidden'}
									w='200px'
									aspectRatio={1 / 1}
									position={'relative'}
									className='border-primary-dark_marron border'
								>
									<Image
										src={SERVER_URL + `/media/${item.image}`}
										alt={'Product Image'}
										width={500}
										height={500}
										className='h-full w-full rounded-2xl object-cover mix-blend-multiply object-center'
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
									className='w-full'
									href={{
										pathname: `/products/${item.productCode}`,
										query: {
											productId: item.productId,
										},
									}}
								>
									<Box>
										<Text fontWeight={'medium'} textColor={'black'}>
											{item.name}
										</Text>
										<Text textColor={'#8E8E8E'}>Product Code: {item.productCode}</Text>
										<Text textColor={'#8E8E8E'} marginTop={'0.5rem'}>
											Description: {item.description}
										</Text>
										<Text textColor={'#8E8E8E'} marginTop={'0.5rem'}>
											Price: ₹ {item.price - item.discount}
										</Text>
									</Box>
								</Link>
								<Flex className='flex-col md:flex-row gap-3 w-full  md:w-[400px]'>
									<Flex className='gap-3'>
										<AddToCart id={item.productId} />

										<WishlistButton id={item.productId} defaultVal />
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					))}
				</VStack>
			</Box>
		</Box>
	);
}
