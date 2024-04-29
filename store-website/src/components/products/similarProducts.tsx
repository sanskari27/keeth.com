import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { SERVER_URL } from '@/lib/const';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { DM_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

async function getData(productCode: string) {
	try {
		const res = await fetch(SERVER_URL + `/product-group/similar-products/${productCode}`, {
			next: { revalidate: 0 },
		});
		if (!res.ok) {
			return [];
		}

		const data = await res.json();

		const products = data.products as {
			productCode: string;
			image: string;
			discount: number;
			price: number;
		}[];
		return products;
	} catch (err) {
		return [];
	}
}

export default async function SimilarProducts({ productCode }: { productCode: string }) {
	const products = await getData(productCode);
	console.log(products);

	return (
		<Box className='px-[5%] md:px-[7%]' py={'1.5%'} hidden={products.length === 0}>
			<Text className='aura-bella font-thin text-primary-dark_red text-3xl md:text-4xl'>
				Similar Products
			</Text>
			<Box px={'1%'} marginTop={'-1rem'}>
				<Carousel>
					<CarouselContent>
						{products.map((product) => (
							<CarouselItem key={product.productCode} className='md:basis-1/3 lg:basis-[27%] p-8'>
								<Box
									rounded={'2xl'}
									bgColor={'RGBA(0, 0, 0, 0.1)'}
									className='w-[250px] h-[280px] md:w-[380px] md:h-[450px] shadow-md drop-shadow-md'
									p='25px'
								>
									<Flex
										rounded={'2xl'}
										bgColor={'white'}
										aspectRatio={1 / 1}
										width={'full'}
										justifyContent={'center'}
										alignItems={'center'}
									>
										<Image
											src={SERVER_URL + `/media/${product.image}`}
											alt={product.productCode}
											width={500}
											height={500}
											className='rounded-2xl object-cover mix-blend-multiply '
											priority
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
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</Box>
		</Box>
	);
}
