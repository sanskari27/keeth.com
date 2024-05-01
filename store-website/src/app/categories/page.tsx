import { SERVER_URL } from '@/lib/const';
import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import { DM_Mono } from 'next/font/google';
import Link from 'next/link';

const dm_mono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'] });

async function getData() {
	try {
		const res = await fetch(SERVER_URL + `/collections`, { next: { revalidate: 3600 } });
		if (!res.ok) {
			return [];
		}

		const data = await res.json();

		const collections = data.collections as {
			id: string;
			name: string;
			image: string;
			tags: string[];
			visibleAtHome: boolean;
			productCodes: string[];
		}[];
		return collections;
	} catch (err) {
		return [];
	}
}

export default async function Categories() {
	let collections = await getData();
	collections = collections.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<section>
			<VStack
				width='full'
				pt={'110px'}
				pb={'1rem'}
				gap={'1rem'}
				alignItems={'flex-start'}
				className='px-[5%] md:px-[7%] '
			>
				<Text className='w-full text-2xl md:text-4xl aura-bella text-center md:text-left'>
					All Categories
				</Text>
				<Box width={'full'}>
					<Grid className='w-full grid-cols-2 md:grid-cols-4 gap-6 md:gap-9'>
						{collections.map((collection, index) => (
							<GridItem key={index} className='text-center md:text-left'>
								<Box width={'full'}>
									<Link
										className='w-full'
										href={{
											pathname: '/products',
											query: {
												collections: collection.id,
											},
										}}
									>
										<Text
											className={
												dm_mono.className + ' text-lg md:text-2xl hover:underline transition-all'
											}
											fontWeight={'medium'}
										>
											{collection.name}
										</Text>
									</Link>
									<ul className='list-disc w-max mx-auto md:mx-0 '>
										{collection.tags.map((tag, index) => (
											<li key={index}>
												<Link
													className='w-full'
													href={{
														pathname: '/products',
														query: {
															tags: tag,
														},
													}}
												>
													<Text
														className={
															dm_mono.className +
															' text-base md:text-lg hover:underline transition-all'
														}
														fontSize={'md'}
													>
														{tag}
													</Text>
												</Link>
											</li>
										))}
									</ul>
								</Box>
							</GridItem>
						))}
					</Grid>
				</Box>
			</VStack>
		</section>
	);
}
