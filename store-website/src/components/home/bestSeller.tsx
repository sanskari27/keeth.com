import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { SERVER_URL } from '@/lib/const';
import { getBestSellers } from '@/services/product.service';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

export default async function BestSeller() {
	const products = await getBestSellers();
	return (
		<Box px={'3%'} py={'1.5%'}>
			<Text className='aura-bella font-thin text-primary-dark_red text-3xl md:text-4xl'>
				Best Sellers
			</Text>
			<Box px={'1%'} marginTop={'-1rem'}>
				<Carousel>
					<CarouselContent>
						{products.map((product) => (
							<CarouselItem key={product.productCode} className='md:basis-1/3 lg:basis-[27%] p-8'>
								<Link className='w-full' href={`/products/${product.productCode}`}>
									<Box
										rounded={'2xl'}
										bgColor={'RGBA(0, 0, 0, 0.1)'}
										className='w-[250px] h-[280px] md:w-[380px] md:h-[430px] shadow-md drop-shadow-md'
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
												className='rounded-2xl w-full h-full object-cover mix-blend-multiply '
											/>
										</Flex>
										<Flex
											width={'full'}
											justifyContent={'space-between'}
											alignItems={'center'}
											marginTop={'1rem'}
										>
											<Text
												className='aura-bella text-medium text-2xl md:text-3xl'
												textTransform={'uppercase'}
											>
												{product.productCode}
											</Text>
											{/* <Text className='text-lg ms:text-2xl'>A17610</Text> */}
										</Flex>
									</Box>
								</Link>
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
