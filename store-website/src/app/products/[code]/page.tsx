import CollectionBar from '@/components/collectionBar';
import { AddToCart, BuyNowButton, WishlistButton } from '@/components/products/buttons';
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
import { QUOTES } from '@/lib/const';
import { productDetails } from '@/services/product.service';
import { Avatar, Box, Card, CardBody, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Metadata } from 'next';
import { DM_Mono } from 'next/font/google';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

export const revalidate = 3600;

const TESTIMONIALS = [
	{
		message: `I cannot express enough how thrilled I am with the exquisite craftsmanship of the necklace I purchased from Keeth Jewels. It's not just jewelry; it's wearable art that adds an elegant touch to any outfit. Thank you for creating such timeless pieces!`,
		rating: 5,
		name: 'Aryan Singh',
		image:
			'https://images.unsplash.com/photo-1533020686971-56a0e1d3c731?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0NjE5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `As someone who values both style and comfort, I couldn't be happier with the ring I purchased from Keeth Jewels. It's not only stunning to look at but also feels incredibly comfortable to wear all day. Truly a testament to their dedication to quality and design.`,
		rating: 4,
		name: 'Gulshan Kumar',
		image:
			'https://images.unsplash.com/photo-1622381355313-7e86da83e21f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0NTg5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `'ve been a longtime admirer of Keeth Jewels, and the necklace I recently purchased only solidified my admiration. It's evident that each piece is created with passion and precision, resulting in jewelry that is both stunning and durable. I look forward to adding more of their creations to my collection in the future.`,
		rating: 4,
		name: 'Sunanda Mishra',
		image:
			'https://images.unsplash.com/photo-1527610753782-d450c31409ce?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLWZlbWFsZXx8fHx8fDE3MTQ5MDQ2NDE&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `From the moment I laid eyes on the bracelet I bought from Keeth Jewels, I knew it was something special. The attention to detail and the unique design make it a standout piece in my collection. I receive compliments every time I wear it, and I couldn't be more pleased with my purchase.`,
		rating: 5,
		name: 'Rocky Raj',
		image:
			'https://images.unsplash.com/photo-1577760960310-c49bbb09161e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0NDI4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `I recently purchased a pair of earrings from Keeth Jewels, and I must say, they exceeded my expectations. The intricate design combined with the superior craftsmanship makes them a must-have accessory for any occasion. Thank you for offering such a beautiful selection of jewelry!`,
		rating: 4,
		name: 'Aslam Ahmed',
		image:
			'https://images.unsplash.com/photo-1614959019489-e88b6c0def00?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0Mzk0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `"As someone who appreciates the finer things in life, I was delighted to discover Keeth Jewels. The necklace I purchased not only reflects my personal style but also showcases the brand's commitment to excellence. I couldn't be happier with my purchase and highly recommend Keeth Jewels to anyone looking for top-quality jewelry.`,
		rating: 5,
		name: 'Anshu Dhal',
		image:
			'https://images.unsplash.com/photo-1599379695366-8fdbdb961d85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0Mzc3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
];

type Props = {
	params: { code: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
	// read route params

	const products = await productDetails(params.code);

	if (!products.length) {
		return {
			title: 'Product not found • Keeth',
		};
	}

	const filtered = products.filter((p) => {
		if (searchParams['productId']) {
			return p.id === searchParams['productId'];
		}
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
		return {
			title: 'Product not found • Keeth',
		};
	}

	const product = filtered[0];

	return {
		title: `${product.name} • Keeth`,
	};
}

export default async function ProductDetails({ params, searchParams }: Props) {
	const products = await productDetails(params.code);

	if (!products.length) {
		redirect('/not-found');
	}

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
		if (searchParams['productId']) {
			return p.id === searchParams['productId'];
		}
		if (searchParams['metal_color']) {
			if (p.metal_color !== searchParams['metal_color']) {
				return false;
			}
		}
		if (searchParams['metal_quality']) {
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
				<Suspense fallback={<div>Loading Collections...</div>}>
					<CollectionBar />
				</Suspense>

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
								<Suspense fallback={<div>Loading Customization...</div>}>
									<Customization
										{...{ colors, qualities, diamond_types, sizes }}
										defaultValues={{
											size: product.size,
											metal_color: product.metal_color,
											metal_quality: product.metal_quality,
											diamond_type: product.diamond_type,
										}}
									/>
								</Suspense>
							</Box>
							<Box width={'full'} marginTop={'1.5rem'}>
								<Flex className='flex-col md:flex-row gap-3'>
									<Flex className='gap-3'>
										<BuyNowButton id={product.id} />
									</Flex>
									<Flex className='gap-3'>
										<AddToCart id={product.id} />
										<WishlistButton id={product.id} />
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
				<Box py={'3%'} className='px-[5%] md:px-[7%] mt-8'>
					<Text className='aura-bella font-thin text-primary-dark_red text-3xl md:text-4xl'>
						What Our Customer says
					</Text>
					<Box px={'1%'} marginTop={'-1rem'} position={'relative'}>
						<Carousel>
							<CarouselContent>
								{TESTIMONIALS.map((t, index) => (
									<CarouselItem className='md:basis-1/3 p-8' key={index}>
										<Card className='bg-white w-[350px] py-2 md:w-[420px]  shadow-xl drop-shadow-xl rounded-2xl overflow-hidden'>
											<CardBody bgColor={'white'}>
												<Box bgColor={'white'}>
													<VStack width={'full'}>
														<Text textAlign={'justify'}>{t.message}</Text>
														<HStack width={'full'} justifyContent={'flex-start'}>
															<Avatar src={t.image} />
															<VStack width={'full'} alignItems={'flex-start'} px={'1rem'}>
																<Text>{t.name}</Text>
																<Text>
																	{Array.from({ length: t.rating })
																		.fill(0)
																		.map((_, index) => (
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
