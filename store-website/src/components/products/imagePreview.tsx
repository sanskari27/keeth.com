'use client';
import { SERVER_URL } from '@/lib/const';
import { cn } from '@/lib/utils';
import { Box, Center, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '../ui/carousel';
import VideoPlayer from '../video-player';

export default function ProductPreview({ images, videos }: { images: string[]; videos: string[] }) {
	const [state, setState] = useState(images[0]);
	const [type, setType] = useState<'image' | 'video'>('image');

	return (
		<VStack p={'1rem'} className='w-[400px] justify-center items-center md:w-[550px] '>
			<Box>
				{type === 'image' && (
					<Center
						rounded={'2xl'}
						overflow={'hidden'}
						w='full'
						aspectRatio={1 / 1}
						position={'relative'}
					>
						<Image
							src={SERVER_URL + `/media/${state}`}
							alt={'Product Image'}
							width={500}
							height={500}
							className='rounded-2xl object-contain mix-blend-multiply object-center'
							priority
						/>
					</Center>
				)}
				{type === 'video' && (
					<Center
						rounded={'2xl'}
						overflow={'hidden'}
						w='full'
						aspectRatio={1 / 1}
						position={'relative'}
					>
						<VideoPlayer
							src={SERVER_URL + `/media/${state}`}
							controls={false}
							className='object-cover'
						/>
					</Center>
				)}
			</Box>
			<Box width='full'>
				<Carousel>
					<CarouselContent>
						{images.map((item, index) => (
							<CarouselItem key={index} className='basis-1/4 md:basis-1/5 '>
								<Box
									rounded={'2xl'}
									overflow={'hidden'}
									className={cn(
										'w-[80px] h-[80px] bg-[#F0F0F0]',
										item === state ? 'border-primary-dark_marron border' : ''
									)}
									onClick={() => {
										setState(item);
										setType('image');
									}}
									position={'relative'}
								>
									<Image
										src={SERVER_URL + `/media/${item}`}
										alt={'Product Image'}
										width={500}
										height={500}
										className='rounded-2xl h-full w-full object-cover mix-blend-multiply object-center'
										priority
									/>
								</Box>
							</CarouselItem>
						))}
						{videos.map((item, index) => (
							<CarouselItem key={index} className='basis-1/4 md:basis-1/5 '>
								<Box
									rounded={'2xl'}
									overflow={'hidden'}
									className={cn(
										'w-[80px] h-[80px] bg-[#F0F0F0] ',
										item === state ? 'border-primary-dark_marron border' : ''
									)}
									onClick={() => {
										setState(item);
										setType('video');
									}}
									position={'relative'}
								>
									<VideoPlayer
										src={SERVER_URL + `/media/${item}`}
										autoPlay={true}
										controls={false}
										className='object-cover w-full h-full'
									/>
								</Box>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</Box>
		</VStack>
	);
}
