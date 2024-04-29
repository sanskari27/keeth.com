import CollectionBar from '@/components/collectionBar';
import Customization from '@/components/products/customization';
import CustomizationNotAvailable from '@/components/products/customizationNotAvailable';
import ProductPreview from '@/components/products/imagePreview';
import SimilarProducts from '@/components/products/similarProducts';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { QUOTES, SERVER_URL } from '@/lib/const';
import { Avatar, Box, Button, Card, CardBody, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { DM_Mono } from 'next/font/google';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

const TESTIMONIALS = [
	{
		message: `Absolutely stunning piece! I ordered a delicate diamond pendant for my
													wife's birthday, and she was thrilled! The craftsmanship is impeccable,
													and the diamonds sparkle brilliantly. The shipping was fast, and the
													packaging was elegant. Highly recommend this store for anyone looking for
													high-quality jewelry`,
		rating: 4,
		name: 'Gagan Mehta',
	},
	{
		message: `Absolutely stunning piece! I ordered a delicate diamond pendant for my
													wife's birthday, and she was thrilled! The craftsmanship is impeccable,
													and the diamonds sparkle brilliantly. The shipping was fast, and the
													packaging was elegant. Highly recommend this store for anyone looking for
													high-quality jewelry`,
		rating: 4,
		name: 'Gagan Mehta',
	},
	{
		message: `Absolutely stunning piece! I ordered a delicate diamond pendant for my
													wife's birthday, and she was thrilled! The craftsmanship is impeccable,
													and the diamonds sparkle brilliantly. The shipping was fast, and the
													packaging was elegant. Highly recommend this store for anyone looking for
													high-quality jewelry`,
		rating: 4,
		name: 'Gagan Mehta',
	},
	{
		message: `Absolutely stunning piece! I ordered a delicate diamond pendant for my
													wife's birthday, and she was thrilled! The craftsmanship is impeccable,
													and the diamonds sparkle brilliantly. The shipping was fast, and the
													packaging was elegant. Highly recommend this store for anyone looking for
													high-quality jewelry`,
		rating: 4,
		name: 'Gagan Mehta',
	},
];

async function getData(code: string) {
	try {
		const res = await fetch(SERVER_URL + `/products/product-code/${code}`, {
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			return [];
		}

		const data = await res.json();

		const products = data.products as {
			id: string;
			productCode: string;
			name: string;
			description: string;
			details: string;
			pricing_bifurcation: string;
			images: string[];
			videos: string[];
			tags: string[];
			size: string | null;
			metal_color: string;
			metal_type: string;
			metal_quality: string;
			diamond_type: string | null;
			price: number;
			discount: number;
			discontinued: boolean;
			listedOn: Date;
		}[];
		return products;
	} catch (err) {
		return [];
	}
}

export default async function ProductDetails({
	params,
	searchParams,
}: {
	params: { code: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const products = await getData(params.code);

	if (!products.length) {
		redirect('/not-found');
	}
	console.log(products);

	const customizations = products.reduce(
		(acc, item) => {
			if (!acc.colors.includes(item.metal_color)) {
				acc.colors.push(item.metal_color);
			}
			if (!acc.qualities.includes(item.metal_quality)) {
				acc.qualities.push(item.metal_quality);
			}
			if (item.diamond_type && !acc.diamond_types.includes(item.diamond_type)) {
				acc.diamond_types.push(item.diamond_type);
			}
			if (item.size && !acc.sizes.includes(item.size)) {
				acc.sizes.push(item.size);
			}
			return acc;
		},
		{
			colors: [],
			qualities: [],
			diamond_types: [],
			sizes: [],
		} as {
			colors: string[];
			qualities: string[];
			diamond_types: string[];
			sizes: string[];
		}
	);

	const filtered = products.filter((p) => {
		if (searchParams['metal_color']) {
			if (p.metal_color !== searchParams['metal_color']) {
				return false;
			}
		} else if (searchParams['metal_quality']) {
			if (p.metal_quality !== searchParams['metal_quality']) {
				return false;
			}
		}
		if (searchParams['diamond_type']) {
			if (p.diamond_type !== searchParams['diamond_type']) {
				return false;
			}
		}
		if (searchParams['size']) {
			if (p.size !== searchParams['size']) {
				return false;
			}
		}
		return true;
	});

	if (filtered.length === 0) {
		return (
			<section>
				<Box width='full' pt={'80px'} pb={'1rem'} gap={'1rem'}>
					<CollectionBar />

					<CustomizationNotAvailable />
				</Box>
			</section>
		);
	}

	const product = filtered[0];

	const colors = customizations.colors.sort();
	const qualities = customizations.qualities.sort();
	const diamond_types = customizations.diamond_types.sort();
	const sizes = customizations.sizes.sort();

	return (
		<section>
			<Box width='full' pt={'80px'} pb={'1rem'} gap={'1rem'}>
				<CollectionBar />

				<Flex className='flex-col md:flex-row md:px-[5%]'>
					<Box>
						<VStack width={'full'}>
							<ProductPreview images={product.images} videos={product.videos} />
						</VStack>
					</Box>
					<Box width={'full'}>
						<Box marginTop={'3rem'} w={'full'} className='px-8 md:px-12'>
							<Text
								className='text-2xl md:text-5xl aura-bella font-bold'
								bgGradient='linear(to-r, #DB3E42, #D25D42)'
								bgClip='text'
							>
								{product.name}
							</Text>
							<Text className='text-lg md:text-2xl aura-bella tracking-wider'>
								{product.details}
							</Text>
							<Flex alignItems={'end'}>
								<Text
									className={`text-2xl md:text-4xl mt-6 md:mt-12 tracking-tighter ${dm_mono.className}`}
								>
									₹{(product.price - product.discount).toLocaleString()}
								</Text>
								<Text className={`text-xl  md:text-2xl mt-3 md:mt-3 line-through px-6`}>
									₹{product.price.toLocaleString()}
								</Text>
							</Flex>
							<Text className={`text-base md:text-lg mt-1 `}>MRP Incl. Of All Taxes</Text>
							<Text className='text-base md:text-lg' marginTop={'1rem'}>
								{product.description}
							</Text>
							<Box className='w-full mt-8 md:mt-16'>
								<Customization {...{ colors, qualities, diamond_types, sizes }} />
							</Box>
							<Box width={'full'} marginTop={'1.5rem'}>
								<Flex className='flex-col md:flex-row gap-3'>
									<Flex className='gap-3'>
										<Button
											bgColor={'#FFE5CF'}
											py='0.5rem'
											px='3rem'
											rounded={'md'}
											_hover={{
												bgColor: '#F3D4BB',
											}}
											className='w-full md:w-max'
											// onChange={(e) => handleChange(e.target.name, e.target.value)}
										>
											<Text fontWeight={'medium'}>Buy Now</Text>
										</Button>
									</Flex>
									<Flex className='gap-3'>
										<Button
											bgColor={'#F0F0F0'}
											py='0.5rem'
											px='2rem'
											rounded={'md'}
											_hover={{
												bgColor: '#E8E8E8',
											}}
											className='w-full md:w-max'
											leftIcon={<FiShoppingCart />}
											// onChange={(e) => handleChange(e.target.name, e.target.value)}
										>
											<Text fontWeight={'medium'}>Add To Cart</Text>
										</Button>
										<Button
											borderColor={'#891618'}
											variant={'outline'}
											py='0.5rem'
											px='1rem'
											rounded={'md'}
										>
											<FaRegHeart color='#891618' />
										</Button>
									</Flex>
								</Flex>
							</Box>
						</Box>
					</Box>
				</Flex>

				<Box className='px-[5%] md:px-[7%]'>
					<Text fontSize={'1.1rem'} fontWeight={'bold'}>
						Product Details
					</Text>
					<Box width={'full'} className='custom-table'>
						<Box dangerouslySetInnerHTML={{ __html: product.pricing_bifurcation }} />
					</Box>
				</Box>

				{/* ------------------------------------------------------------------Testimonials   ------------------------------------------------*/}
				<Box py={'3%'} className='px-[5%] md:px-[7%]'>
					<Text className='aura-bella font-thin text-primary-dark_red text-3xl md:text-4xl'>
						What Our Customer says
					</Text>
					<Box px={'1%'} marginTop={'-1rem'} position={'relative'}>
						<Carousel>
							<CarouselContent>
								{TESTIMONIALS.map((t) => (
									<CarouselItem className='md:basis-1/3 p-8'>
										<Card className='bg-white w-[350px] py-2 md:w-[450px]  shadow-xl drop-shadow-xl rounded-2xl overflow-hidden'>
											<CardBody bgColor={'white'}>
												<Box bgColor={'white'}>
													<VStack width={'full'}>
														<Text textAlign={'justify'}>{t.message}</Text>
														<HStack width={'full'} justifyContent={'flex-start'}>
															<Avatar src='https://bit.ly/dan-abramov' />
															<VStack width={'full'} alignItems={'flex-start'} px={'1rem'}>
																<Text>{t.name}</Text>
																<Text>
																	{Array.from({ length: t.rating })
																		.fill(0)
																		.map((item, index) => (
																			<span key={index}>⭐️</span>
																		))}
																</Text>
															</VStack>
														</HStack>
													</VStack>
												</Box>
											</CardBody>
										</Card>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>

						<Image
							src={QUOTES}
							alt='QUOTES'
							width={500}
							height={500}
							className='hidden md:block absolute right-12 -top-28 -z-[1] md:h-[200px] rounded-2xl object-contain'
						/>
					</Box>
				</Box>

				<SimilarProducts productCode={params.code} />
			</Box>
		</section>
	);
}
