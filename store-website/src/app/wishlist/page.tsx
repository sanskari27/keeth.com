'use client';
import useAuth from '@/hooks/useAuth';
import { SERVER_URL } from '@/lib/const';
import { fetchWishlist } from '@/services/wishlist.service';
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

export default function Wishlist() {
	const { loading } = useAuth({
		fallbackUrl: '/login?referrer=wishlist',
	});

	const [list, setList] = useState<
		{
			productId: string;
			name: string;
			description: string;
			price: number;
			discount: number;
			image: string | null;
		}[]
	>([]);

	useState(() => {
		fetchWishlist().then(setList);
	});

	// if (loading) {
	// 	return <></>;
	// }

	return (
		<Box pt={'100px'} px={'5%'}>
			<Heading>
				<Text className='aura-bella text-2xl md:text-4xl font-light' color={'#DB3E42'}>
					Your Wishlist
				</Text>
			</Heading>

			<Box className='my-6 '>
				<VStack width={'full'} alignItems={'flex-start'}>
					{list.map((item) => (
						<Flex className='gap-3' key={item.productId}>
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
							<Flex
								rounded={'2xl'}
								overflow={'hidden'}
								position={'relative'}
								direction={'column'}
								justifyContent={'space-around'}
							>
								<Box>
									<Text fontWeight={'medium'} textColor={'black'}>
										The Gianna Ring
									</Text>
									<Text textColor={'#8E8E8E'}>Product Code: 123</Text>
									<Text textColor={'#8E8E8E'} marginTop={'0.5rem'}>
										Description
									</Text>
									<Text textColor={'#8E8E8E'} marginTop={'0.5rem'}>
										Price
									</Text>
								</Box>
								<Flex className='flex-col md:flex-row gap-3 w-full  md:w-[400px]'>
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
											borderColor={'red'}
											variant={'outline'}
											py='0.5rem'
											px='1rem'
											rounded={'md'}
										>
											<MdDelete color='red' />
										</Button>
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
