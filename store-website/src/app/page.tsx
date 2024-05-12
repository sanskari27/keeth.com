import {
	ARRIVALS_BANGLES,
	ARRIVALS_EARRINGS,
	ARRIVALS_NECKLACE,
	ARRIVALS_PENDANTS,
	HOME_SCREEN_MODAL,
	HOME_SCREEN_RINGS,
	QUOTES,
} from '@/lib/const';
import {
	Avatar,
	Box,
	Card,
	CardBody,
	Image as ChakraImage,
	Flex,
	HStack,
	Heading,
	Text,
	VStack,
} from '@chakra-ui/react';
import { default as Image } from 'next/image';
import Link from 'next/link';

import BestSeller from '@/components/home/bestSeller';
import ShopByCollections from '@/components/home/shopByCollections';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

const HOME_TESTIMONIALS = [
	{
		message: `I ordered wedding ring for my wife and it was a masterpiece. She liked the design and the finishing of the product.It just felt the most attractive piece of art in our wedding.Thankyou Keeth Jewels for delievering such a good quality product.`,
		rating: 4,
		name: 'Gagan Mehta',
		image:
			'https://images.unsplash.com/photo-1521870749737-92928aafcc21?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTAzOTU2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `I bought earrings for daily office wear and the product was so handy for the daily use jewellery. The collegues were just amazed with simplicity and subtleness of the product. Loved it.`,
		rating: 5,
		name: 'Gauri',
		image:
			'https://images.unsplash.com/photo-1513097633097-329a3a64e0d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLWZlbWFsZXx8fHx8fDE3MTUxMDE3MTQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `The blend of fine art, tradition and modern design,this is what i really like about Keeth Jewels. The comfort for the daily use is awesome.`,
		rating: 4,
		name: 'Neha Sharma',
		image:
			'https://images.unsplash.com/photo-1541964941-510c462a8fcc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLWZlbWFsZXx8fHx8fDE3MTQ5MDQyNjQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `The diamond pendant from keeth jewels is outstanding in terms of design details and finish quality. Really Impressed from your work and timely delievery.`,
		rating: 4,
		name: 'Rahul Nanda',
		image:
			'https://images.unsplash.com/flagged/photo-1563713076139-d9f44e576124?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0MTEx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
	{
		message: `Keeping the Indian Tradition alive with the pinch of futuristic design. Their jewellery is really pure and easy to wear. Such small gestures from thier side makes a good brand to buy from.`,
		rating: 5,
		name: 'Tanmay Reddy',
		image:
			'https://images.unsplash.com/photo-1606214443385-df9571086793?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuLW1hbGV8fHx8fHwxNzE0OTA0MjIy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
	},
];

const SOCIAL_MEDIA = [ARRIVALS_BANGLES, ARRIVALS_EARRINGS];

export default async function Home() {
	return (
		<main>
			<Box>
				<Box
					position={'absolute'}
					w={'100vw'}
					h={'100vh'}
					left={'0'}
					top={'0'}
					userSelect={'none'}
					zIndex={'-10'}
				>
					<Box position={'relative'} overflow={'hidden'} w={'100vw'} h={'100vh'}>
						<ChakraImage
							src={HOME_SCREEN_MODAL}
							className='h-screen w-screen absolute left-0 top-0 -z-10 md:block hidden'
						/>
						<Image
							src={HOME_SCREEN_RINGS}
							alt='Rings'
							width={1000}
							height={1000}
							className='w-[600px]  absolute  md:-left-[7%] -bottom-[25%] md:-bottom-[35%] mix-blend-multiply'
							priority
						/>
					</Box>
				</Box>
				<Flex
					direction={'column'}
					justifyContent={'center'}
					alignItems={'flex-start'}
					height={'100vh'}
				>
					<Heading
						className='w-full !aura-bella text-accent-dark !text-[2rem] md:!text-[4.5rem] text-center md:text-left md:pl-12'
						marginTop={'-3rem'}
						fontWeight={1000}
					>
						Unveil the <span className=' text-primary-brown'>Radiance</span>
					</Heading>
					<Heading
						className='w-full !aura-bella text-accent-dark !text-[1rem] md:!text-[2.5rem] text-center md:text-left -mt-2 md:-mt-4 md:pl-12'
						fontWeight={1000}
					>
						Discover the Art of Elegance
					</Heading>
					<Box className='flex w-full md:block justify-center md:pl-24  ' marginTop={'1.75rem'}>
						<Link
							href='/products'
							className='aura-bella rounded-full py-2 px-4 bg-accent-light text-white text-2xl'
						>
							shop now
						</Link>
					</Box>
				</Flex>
			</Box>

			{/* ------------------------------------------------------------------New Arrivals  ------------------------------------------------*/}
			<Box px={'3%'} py={'2.5%'}>
				<Text className='aura-bella font-thin text-primary-dark_red text-3xl md:text-4xl'>
					New Arrivals
				</Text>
				<Flex gap={3} px={'1%'} marginTop={'0.5rem'} className='flex-col md:flex-row'>
					<Box width={'full'}>
						<VStack width={'full'}>
							<Box
								width={'full'}
								position={'relative'}
								rounded={'2xl'}
								overflow={'hidden'}
								className='shadow-md drop-shadow-md'
							>
								<Image
									src={ARRIVALS_BANGLES}
									alt='Bangles'
									width={500}
									height={500}
									className='w-full h-[150px] md:h-[200px] rounded-2xl object-cover '
									priority
								/>
								<Box className='shadow-div h-[120px] md:h-[150px] ' />
							</Box>
							<Flex width={'full'} gap={3}>
								<Box
									width={'full'}
									position={'relative'}
									rounded={'2xl'}
									overflow={'hidden'}
									className='shadow-md drop-shadow-md'
								>
									<Image
										src={ARRIVALS_PENDANTS}
										alt='ARRIVALS_PENDANTS'
										width={500}
										height={500}
										className='w-full h-[150px] md:h-[200px] rounded-2xl object-cover'
										priority
									/>
									<Box className='shadow-div h-[80px] md:h-[120px]  ' />
									<Text className='aura-bella font-thin text-white text-2xl md:text-3xl absolute left-4 bottom-4'>
										pendents
									</Text>
								</Box>
								<Box
									width={'full'}
									position={'relative'}
									rounded={'2xl'}
									overflow={'hidden'}
									className='shadow-md drop-shadow-md'
								>
									<Image
										src={ARRIVALS_EARRINGS}
										alt='ARRIVALS_EARRINGS'
										width={500}
										height={500}
										className='w-full h-[150px] md:h-[200px] rounded-2xl object-cover'
										priority
									/>
									<Box className='shadow-div h-[80px] md:h-[120px]  ' />
									<Text className='aura-bella font-thin text-white text-2xl md:text-3xl absolute left-4 bottom-4'>
										ear rings
									</Text>
								</Box>
							</Flex>
						</VStack>
					</Box>
					<Box width={'full'}>
						<VStack width={'full'}>
							<Box
								width={'full'}
								position={'relative'}
								overflow={'hidden'}
								rounded={'2xl'}
								className='shadow-md drop-shadow-md'
							>
								<Image
									src={ARRIVALS_NECKLACE}
									alt='ARRIVALS_NECKLACE'
									width={500}
									height={500}
									className='w-full h-[150px] md:h-[200px] rounded-2xl object-cover'
									priority
								/>
								<Box className='shadow-div h-[120px] md:h-[150px] ' />
							</Box>
							<Flex width={'full'} gap={3}>
								<Box
									width={'full'}
									position={'relative'}
									overflow={'hidden'}
									rounded={'2xl'}
									className='shadow-md drop-shadow-md'
								>
									<Image
										src={ARRIVALS_PENDANTS}
										alt='ARRIVALS_PENDANTS'
										width={500}
										height={500}
										className='w-full h-[150px] md:h-[200px] rounded-2xl object-cover'
										priority
									/>
									<Box className='shadow-div h-[80px] md:h-[120px] ' />
									<Text className='aura-bella font-thin text-white text-2xl md:text-3xl absolute left-4 bottom-4'>
										pendents
									</Text>
								</Box>
								<Box
									width={'full'}
									position={'relative'}
									overflow={'hidden'}
									rounded={'2xl'}
									className='shadow-md drop-shadow-md'
								>
									<Image
										src={ARRIVALS_EARRINGS}
										alt='ARRIVALS_EARRINGS'
										width={500}
										height={500}
										className='w-full h-[150px] md:h-[200px] rounded-2xl object-cover'
										priority
									/>
									<Box className='shadow-div h-[80px] md:h-[120px] ' />
									<Text className='aura-bella font-thin text-white text-2xl md:text-3xl absolute left-4 bottom-4'>
										ear rings
									</Text>
								</Box>
							</Flex>
						</VStack>
					</Box>
				</Flex>
			</Box>

			{/*  ------------------------------------------------------------------Best Seller and Collections ------------------------------------------------------------------ */}

			<BestSeller />
			<ShopByCollections />

			{/* ------------------------------------------------------------------Testimonials   ------------------------------------------------*/}
			<Box px={'3%'} py={'1.5%'}>
				<Text className='aura-bella font-thin text-primary-dark_red text-3xl md:text-4xl'>
					What Our Customer says
				</Text>
				<Box px={'1%'} marginTop={'-1rem'} position={'relative'}>
					<Carousel>
						<CarouselContent>
							{HOME_TESTIMONIALS.map((t, index) => (
								<CarouselItem className='md:basis-1/3 p-8' key={index}>
									<Card className='bg-white w-[350px] py-2 md:w-[450px]  shadow-xl drop-shadow-xl rounded-2xl overflow-hidden'>
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

			{/* ------------------------------------------------------------------Social Media   ------------------------------------------------*/}
			<Box px={'3%'} py={'1.5%'}>
				<Box px={'1%'} position={'relative'}>
					<Carousel>
						<CarouselContent>
							{SOCIAL_MEDIA.map((t, index) => (
								<CarouselItem key={index} className='md:basis-1/3 p-8'>
									<Box
										rounded={'2xl'}
										overflow={'hidden'}
										className='w-[300px] h-[165px] md:w-[450px] md:h-[250px] shadow-md drop-shadow-md'
										position={'relative'}
									>
										<Image
											src={t}
											alt={''}
											width={500}
											height={500}
											className='rounded-2xl object-cover mix-blend-multiply object-center'
										/>
										<Box className='shadow-div shadow-light h-[100px]' />
									</Box>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</Box>
			</Box>
		</main>
	);
}
