import CollectionBar from '@/components/collectionBar';
import FilterBar from '@/components/filterBar';
import VideoPlayer from '@/components/video-player';
import { SERVER_URL } from '@/lib/const';
import { Box, Button, Center, Flex, Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import { DM_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

async function getData() {
	try {
		const res = await fetch(SERVER_URL + `/products`, { next: { revalidate: 3600 } });
		if (!res.ok) {
			return [];
		}

		const data = await res.json();

		const products = data.products as {
			productCode: string;
			price: number;
			discount: number;
			images: string[];
			videos: string[];
		}[];
		return products.map((item) => ({
			...item,
			image: item.images.length > 0 ? item.images[0] : '',
			video: item.videos.length > 0 ? item.videos[0] : '',
		}));
	} catch (err) {
		return [];
	}
}

export default async function ProductPage() {
	const products = await getData();

	return (
		<section>
			<VStack width='full' pt={'80px'} pb={'1rem'} gap={'1rem'}>
				<CollectionBar />
				<FilterBar />
				<Box className='mt-4 md:mt-8'>
					<Grid className='grid-cols-2 md:grid-cols-4 gap-6 md:gap-9'>
						{products.map((product, index) => (
							<GridItem key={index}>
								<Box
									rounded={'2xl'}
									bgColor={'RGBA(0, 0, 0, 0.1)'}
									className='w-[180px] h-[250px] md:w-[325px] md:h-[400px] shadow-md drop-shadow-md'
									p='20px'
									position={'relative'}
								>
									<Center
										className='absolute -left-3 -top-3 -rotate-12 w-[70px] aura-bella rounded-full h-[70px] bg-primary-brown text-white font-bold tracking-widest'
										hidden={product.discount === 0}
									>
										{(product.discount * 100) / product.price}% <br /> Off
									</Center>
									<Flex
										rounded={'2xl'}
										bgColor={'white'}
										aspectRatio={1 / 1}
										width={'full'}
										justifyContent={'center'}
										alignItems={'center'}
										className='group'
									>
										<Image
											src={SERVER_URL + `/media/${product.image}`}
											alt={product.productCode}
											width={500}
											height={500}
											className='rounded-2xl object-cover mix-blend-multiply group-hover:hidden'
										/>
										<VideoPlayer
											src={SERVER_URL + `/media/${product.video}`}
											className='hidden group-hover:block'
											playOnHover
										/>
									</Flex>
									<Flex
										width={'full'}
										justifyContent={'space-between'}
										alignItems={'flex-start'}
										marginTop={'0.5rem'}
									>
										<Text
											className='aura-bella text-medium text-xl md:text-2xl'
											textTransform={'uppercase'}
										>
											{product.productCode}
										</Text>
										<Text
											hidden={product.discount === 0}
											className='text-lg ms:text-2xl line-through'
										>
											₹ {product.price}
										</Text>
									</Flex>
									<Flex
										width={'full'}
										justifyContent={'center'}
										alignItems={'center'}
										marginTop={'0.125rem'}
									>
										<Link href={`/products/${product.productCode}`} className='w-full'>
											<Button
												variant={'unstyled'}
												_hover={{
													bgColor: '#B46B43',
												}}
												width={'100%'}
												bgColor={'#CA835B'}
												color={'white'}
												className={dm_mono.className + ' text-lg md:text-xl'}
												fontWeight={'thin'}
												rounded={'xl'}
											>
												₹ {(product.price - product.discount).toLocaleString()}
											</Button>
										</Link>
									</Flex>
								</Box>
							</GridItem>
						))}
					</Grid>
				</Box>
			</VStack>
		</section>
	);
}
