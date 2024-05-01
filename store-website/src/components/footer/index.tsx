import { FOOTER_GIRL } from '@/lib/const';
import { Box, Flex, Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Feedback from './feedback';

export default function Footer() {
	return (
		<footer>
			<Box>
				<Flex
					width={'100vw'}
					position={'relative'}
					className='justify-end md:items-center h-[500px] pt-[4rem] md:pt-0'
				>
					<Image
						src={FOOTER_GIRL}
						alt={'Girl with ear rings'}
						width={500}
						height={500}
						className='bottom-0 md:w-full h-[250px] md:h-[500px] object-cover mix-blend-multiply object-left md:object-center absolute left-0 md:top-0 '
						priority
					/>
					<Box
						bgColor={'#c5c6c8'}
						height={'250px'}
						width={'full'}
						position={'absolute'}
						left={'0'}
						top={'0'}
						zIndex={'-20'}
						className='block md:hidden'
					/>
					<Box
						bgColor={'transparent'}
						className='aura-bella w-full md:w-1/2 font-light z-10 text-center md:text-left '
					>
						<Text className='text-4xl md:text-6xl'>Enchanting Elegance</Text>
						<Text className='text-3xl md:text-5xl'>A Symphony of Sparkles</Text>
						<Flex
							className='flex w-full md:w-1/2 md:block justify-center md:justify-end z-10'
							marginTop={'1.75rem'}
						>
							<Link
								href='/products'
								className='rounded-full py-2 px-4 bg-accent-light text-white text-2xl !font-extrabold'
							>
								Explore All products
							</Link>
						</Flex>
					</Box>
				</Flex>
			</Box>

			<Box marginTop={'-1.5rem'} paddingX={'7%'} width={'full'}>
				<Box
					className='drop-shadow-xl  shadow-xl border-primary-dark_marron '
					bgColor={'white'}
					rounded={'2xl'}
					width={'full'}
					paddingY={'2rem'}
					borderWidth={'1px'}
				>
					<VStack width={'full'}>
						<Text className='aura-bella text-2xl md:text-4xl'>Write us a feedback</Text>

						<Box position={'relative'} width={'94%'} mx='auto'>
							<Feedback />
						</Box>
					</VStack>
				</Box>
			</Box>

			<Box py={'4rem'} paddingX={'4%'}>
				<Flex
					width='full'
					className='flex-col md:flex-row text-center md:text-left  gap-12 md:gap-0'
				>
					<Box width='full'>
						<VStack width='full'>
							<Box width='full'>
								<Text
									className='aura-bella text-4xl md:text-6xl'
									bgGradient='linear(to-r, #DB3E42, #D25D42)'
									bgClip='text'
								>
									Keeth
								</Text>
								<Box
									h={'2px'}
									className='mx-auto md:mx-0 w-[100px] md:w-[150px]'
									bgGradient='linear(to-r, #DB3E42,  #D25D42,transparent)'
								/>
							</Box>

							<Box width={'full'} marginTop={'2rem'}>
								<Text fontWeight={'medium'} className='text-primary-brown' fontSize={'lg'}>
									Follow Us on
								</Text>
								<Flex marginTop={'1rem'} gap={'1rem'} className='justify-center md:justify-start'>
									<Link href={'https://www.instagram.com/sanskar.i274/'} target='_blank'>
										<FaFacebook
											style={{
												height: '2rem',
												width: '2rem',
												color: '#942F1A',
											}}
										/>
									</Link>
									<Link href={'https://www.instagram.com/sanskar.i274/'} target='_blank'>
										<FaInstagram
											style={{
												height: '2rem',
												width: '2rem',
												color: '#942F1A',
											}}
										/>
									</Link>
								</Flex>
							</Box>
						</VStack>
					</Box>
					<VStack className='w-full md:w-2/5' justifyContent={'end'}>
						<Grid className='grid-cols-1 md:grid-cols-2  font-medium text-lg text-center md:text-right gap-y-1 gap-x-9'>
							<GridItem>
								<Link href={'/products'}>
									<Text>Products</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/categories'}>
									<Text>Categories</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/categories'}>
									<Text>Contact us</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/privacy'}>
									<Text>Privacy Policy</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/about'}>
									<Text>About Keeth</Text>
								</Link>
							</GridItem>
							<GridItem>
								<Link href={'/terms'}>
									<Text>Terms & Conditions</Text>
								</Link>
							</GridItem>
						</Grid>
					</VStack>
				</Flex>
			</Box>
		</footer>
	);
}
