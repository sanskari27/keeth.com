'use client';
import { SERVER_URL, WEBSITE_URL } from '@/lib/const';
import { BiReset } from 'react-icons/bi';

import {
	Box,
	Button,
	Checkbox,
	Flex,
	Grid,
	GridItem,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Tag,
	TagLabel,
	Text,
	Wrap,
	WrapItem,
	useBoolean,
} from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { FaFilter } from 'react-icons/fa';
import { MdGraphicEq } from 'react-icons/md';

export default function FilterBar() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const [collections, setCollections] = useState<
		{
			id: string;
			name: string;
		}[]
	>([]);
	const [tags, setTags] = useState<string[]>([]);

	useEffect(() => {
		fetch(SERVER_URL + `/collections`, { next: { revalidate: 3600 } }).then(async (res) => {
			if (!res.ok) return;
			const data = await res.json();

			const collections = data.collections as {
				id: string;
				name: string;
				image: string;
				tags: string[];
				visibleAtHome: boolean;
				productCodes: string[];
			}[];
			setCollections(collections.map((c) => ({ id: c.id, name: c.name })));

			const tags = collections
				.map((c) => c.tags)
				.flat()
				.sort((a, b) => a.localeCompare(b));

			setTags(tags);
		});
	}, []);

	const [data, setData] = useState<{ [key: string]: string | string[] }>({});

	const setValue = (name: string, value: string) => {
		setData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const pushToArray = (name: string, value: string) => {
		setData((prev) => {
			const arr = (prev[name] ?? []) as string[];
			arr.push(value);

			return {
				...prev,
				[name]: arr as string[],
			};
		});
	};

	const popFromArray = (name: string, value: string) => {
		setData((prev) => {
			let arr = (prev[name] ?? []) as string[];
			arr = arr.filter((e) => e !== value);

			return {
				...prev,
				[name]: arr as string[],
			};
		});
	};

	const applyChanges = () => {
		const url = new URL(WEBSITE_URL! + pathname);

		Object.entries(data).forEach(([key, value]) => {
			if (typeof value === 'string') {
				url.searchParams.append(key, value);
			} else {
				url.searchParams.append(key, value.join('_+_'));
			}
		});

		router.replace(url.toString());
		setFilterExpanded.off();
	};

	const resetData = () => {
		const url = new URL(WEBSITE_URL! + pathname);
		router.replace(url.toString());
		setData({});
		setFilterExpanded.off();
	};

	const [isFilterExpanded, setFilterExpanded] = useBoolean(false);

	const keys = useMemo(() => {
		const keys: string[] = [];
		for (const key of searchParams.keys()) {
			keys.push(key);
		}
		return keys;
	}, [searchParams]);

	return (
		<>
			<section className=' h-fit px-4 w-[96%] bg-[#F0F0F0]  mx-[2%] py-2 rounded-full flex items-center justify-between'>
				<Wrap className='gap-3'>
					{keys.map((_key, index) => {
						const value = searchParams.get(_key);
						const key = _key.replace('_', ' ');

						if (!value) {
							return <></>;
						}
						if (value?.includes('_+_')) {
							const values = value.split('_+_');
							return (
								<React.Fragment>
									{values.map((val, index) => (
										<WrapItem key={index}>
											<Tag size={'sm'} borderRadius='full' variant='solid' bgColor='#CA835B'>
												<TagLabel className='capitalize'>
													{key} : <span className='font-medium'>{val}</span>
												</TagLabel>
											</Tag>
										</WrapItem>
									))}
								</React.Fragment>
							);
						}

						return (
							<WrapItem key={index}>
								<Tag size={'sm'} borderRadius='full' variant='solid' bgColor='#CA835B'>
									<TagLabel className='capitalize'>
										{key} : <span className='font-medium'>{value}</span>
									</TagLabel>
								</Tag>
							</WrapItem>
						);
					})}
					{keys.length === 0 ? <Text>No Filters</Text> : null}
				</Wrap>
				<Box cursor={'pointer'} onClick={() => setFilterExpanded.toggle()}>
					{isFilterExpanded ? <FaFilter color='black' /> : <CiFilter />}
				</Box>
			</section>
			<Grid
				hidden={!isFilterExpanded}
				bgColor={'white'}
				width={'96%'}
				mt={'-0.5rem'}
				mx='2%'
				py={'0.5rem'}
				px={'1rem'}
				rounded={'lg'}
				bg='#F0F0F0'
				className='md:max-h-[250px] h-fit transition-all grid-cols-1 md:grid-flow-col gap-x-6'
			>
				<GridItem className='border-r border-black/20 px-6'>
					<Box width={'full'} className='  pb-6'>
						<Text fontWeight={'medium'}>Pricing Range</Text>
						<Flex justifyContent={'space-between'} marginTop={'0.25rem'}>
							<Text>Minimum Price</Text>
							<Text fontWeight={'medium'}>
								₹{data['min_price'] ?? searchParams.get('min_price') ?? 0}
							</Text>
						</Flex>
						<Slider
							aria-label='slider-ex-4'
							min={0}
							max={1000000}
							defaultValue={Number(searchParams.get('min_price')) ?? 0}
							onChange={(val) => setValue('min_price', val.toString())}
						>
							<SliderTrack bg='red.100'>
								<SliderFilledTrack bg='tomato' />
							</SliderTrack>
							<SliderThumb boxSize={6}>
								<Box color='tomato' as={MdGraphicEq} />
							</SliderThumb>
						</Slider>
						<Flex justifyContent={'space-between'}>
							<Text>Maximum Price</Text>
							<Text fontWeight={'medium'}>
								₹{data['max_price'] ?? searchParams.get('max_price') ?? 1000000}
							</Text>
						</Flex>
						<Slider
							aria-label='slider-ex-4'
							min={1000}
							max={1000000}
							defaultValue={Number(searchParams.get('max_price') ?? 1000000) ?? 1000000}
							onChange={(val) => setValue('max_price', val.toString())}
						>
							<SliderTrack bg='red.100'>
								<SliderFilledTrack bg='tomato' />
							</SliderTrack>
							<SliderThumb boxSize={6}>
								<Box color='tomato' as={MdGraphicEq} />
							</SliderThumb>
						</Slider>
					</Box>
				</GridItem>
				<GridItem className='border-r border-black/20 px-2'>
					<Text fontWeight={'medium'}>Metal Color</Text>
					<Box width={'full'} className=' pb-6  flex flex-col gap-3 mt-2'>
						<Checkbox
							colorScheme='red'
							value={'Rose Gold'}
							defaultChecked={searchParams.get('metal_color')?.includes('Rose Gold')}
							onChange={(e) => {
								if (e.target.checked) {
									pushToArray('metal_color', 'Rose Gold');
								} else {
									popFromArray('metal_color', 'Rose Gold');
								}
							}}
							isChecked={data['metal_color']?.includes('Rose Gold') ?? false}
						>
							Rose Gold
						</Checkbox>
						<Checkbox
							colorScheme='red'
							value={'Yellow Gold'}
							defaultChecked={searchParams.get('metal_color')?.includes('Yellow Gold')}
							onChange={(e) => {
								if (e.target.checked) {
									pushToArray('metal_color', 'Yellow Gold');
								} else {
									popFromArray('metal_color', 'Yellow Gold');
								}
							}}
							isChecked={data['metal_color']?.includes('Yellow Gold') ?? false}
						>
							Yellow Gold
						</Checkbox>
						<Checkbox
							colorScheme='red'
							value={'White Gold'}
							defaultChecked={searchParams.get('metal_color')?.includes('White Gold')}
							onChange={(e) => {
								if (e.target.checked) {
									pushToArray('metal_color', 'White Gold');
								} else {
									popFromArray('metal_color', 'White Gold');
								}
							}}
							isChecked={data['metal_color']?.includes('White Gold') ?? false}
						>
							White Gold
						</Checkbox>
					</Box>
				</GridItem>
				<GridItem className='border-r border-black/20 px-2'>
					<Text fontWeight={'medium'}>Gold Purity</Text>
					<Box width={'full'} className=' pb-6  flex flex-col gap-3 mt-2'>
						<Checkbox
							value={'14K'}
							defaultChecked={searchParams.get('metal_quality')?.includes('14K')}
							onChange={(e) => {
								if (e.target.checked) {
									pushToArray('metal_quality', '14K');
								} else {
									popFromArray('metal_quality', '14K');
								}
							}}
							isChecked={data['metal_quality']?.includes('14K') ?? false}
							colorScheme='red'
						>
							14K
						</Checkbox>
						<Checkbox
							value={'18K'}
							defaultChecked={searchParams.get('metal_quality')?.includes('18K')}
							onChange={(e) => {
								if (e.target.checked) {
									pushToArray('metal_quality', '18K');
								} else {
									popFromArray('metal_quality', '18K');
								}
							}}
							isChecked={data['metal_quality']?.includes('18K') ?? false}
							colorScheme='red'
						>
							18K
						</Checkbox>
						<Checkbox
							value={'22K'}
							defaultChecked={searchParams.get('metal_quality')?.includes('22K')}
							onChange={(e) => {
								if (e.target.checked) {
									pushToArray('metal_quality', '22K');
								} else {
									popFromArray('metal_quality', '22K');
								}
							}}
							isChecked={data['metal_quality']?.includes('22K') ?? false}
							colorScheme='red'
						>
							22K
						</Checkbox>
					</Box>
				</GridItem>
				<GridItem className='border-r border-black/20 px-2'>
					<Text fontWeight={'medium'}>Collections</Text>
					<Box
						width={'full'}
						className='max-h-[200px] overflow-y-scroll pb-6 mt-2  flex flex-col gap-3'
					>
						{collections.map(({ id, name }, index) => (
							<Checkbox
								key={index}
								value={id}
								defaultChecked={searchParams.get('collections')?.includes(id)}
								onChange={(e) => {
									if (e.target.checked) {
										pushToArray('collections', id);
									} else {
										popFromArray('collections', id);
									}
								}}
								isChecked={data['collections']?.includes(id) ?? false}
								colorScheme='red'
							>
								{name}
							</Checkbox>
						))}
					</Box>
				</GridItem>
				<GridItem className='px-2 border-r border-black/20'>
					<Text fontWeight={'medium'}>Tags</Text>
					<Box
						width={'full'}
						className='max-h-[200px] overflow-y-scroll pb-6 mt-2  flex flex-col gap-3'
					>
						{tags.map((item, index) => (
							<Checkbox
								key={index}
								value={item}
								defaultChecked={searchParams.get('tags')?.includes(item)}
								onChange={(e) => {
									if (e.target.checked) {
										pushToArray('tags', item);
									} else {
										popFromArray('tags', item);
									}
								}}
								isChecked={data['tags']?.includes(item) ?? false}
								colorScheme='red'
							>
								{item}
							</Checkbox>
						))}
					</Box>
				</GridItem>
				<GridItem className='px-2'>
					<Flex className='h-full flex-col justify-around'>
						<Box height={'100px'}></Box>
						<Flex className='w-full gap-3'>
							<Button
								borderColor={'#891618'}
								variant={'outline'}
								py='0.5rem'
								px='1rem'
								rounded={'md'}
								onClick={resetData}
							>
								<BiReset fontSize={'1.1rem'} color='#891618' />
							</Button>
							<Button
								bgColor={'#FFE5CF'}
								py='0.5rem'
								px='3rem'
								rounded={'md'}
								_hover={{
									bgColor: '#F3D4BB',
								}}
								className='w-full'
								onClick={applyChanges}
							>
								Apply Changes
							</Button>
						</Flex>
					</Flex>
				</GridItem>
			</Grid>
		</>
	);
}
