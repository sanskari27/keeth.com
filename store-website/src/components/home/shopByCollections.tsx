import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { SERVER_URL } from '@/lib/const';
import { homeCollections } from '@/services/product.service';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

export default async function ShopByCollections() {
	const collections = await homeCollections();
	return (
		<Box px={'3%'} py={'1.5%'}>
			<Text className='aura-bella font-thin text-primary-dark_red text-4xl'>
				Shop By Collections
			</Text>
			<Box px={'1%'} marginTop={'-1rem'}>
				<Carousel>
					<CarouselContent>
						{collections.map((collection) => (
							<CarouselItem key={collection.id} className='md:basis-1/3 p-8'>
								<Link className='w-full' href={`/products?collections=${collection.id}`}>
									<Box
										rounded={'2xl'}
										overflow={'hidden'}
										className='w-[300px] h-[165px] md:w-[450px] md:h-[250px] shadow-md drop-shadow-md'
										position={'relative'}
									>
										<Image
											src={SERVER_URL + `/media/${collection.image}`}
											alt={collection.name}
											width={500}
											height={500}
											className='w-full rounded-2xl object-cover mix-blend-multiply'
										/>
										<Box className='shadow-div shadow-light h-[100px]' />
										<Text className='w-full text-center aura-bella absolute left-0 bottom-2  text-medium text-xl md:text-2xl '>
											{collection.name}
										</Text>
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
