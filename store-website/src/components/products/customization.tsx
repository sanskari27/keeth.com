'use client';
import { WEBSITE_URL } from '@/lib/const';
import { Box, Divider, Flex, Grid, GridItem, Select, Text } from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Customization({
	colors,
	qualities,
	diamond_types,
	sizes,
}: {
	colors: string[];
	qualities: string[];
	diamond_types: string[];
	sizes: string[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	function handleChange(name: string, value: string) {
		const url = new URL(WEBSITE_URL! + pathname);

		let added = false;
		searchParams.forEach((val, key) => {
			if (key === name) {
				added = true;
				url.searchParams.append(key, value);
			} else {
				url.searchParams.append(key, val);
			}
		});
		if (!added) {
			url.searchParams.append(name, value);
		}
		console.log(url.toString());

		router.push(url.toString());
	}
	return (
		<Box width={'full'}>
			<Flex width={'full'} alignItems={'center'} gap={'1.5rem'}>
				<Text>Customization</Text>
				<Divider bg='black' className='border !border-black/40' />
			</Flex>

			<Grid className='grid-cols-2 md:grid-cols-4 gap-3'>
				<GridItem>
					<Select
						name='metal_color'
						value={searchParams.get('metal_color') ?? ''}
						placeholder='Select Color'
						bgColor={'#FFE5CF'}
						variant={'filled'}
						onChange={(e) => handleChange(e.target.name, e.target.value)}
					>
						{colors.map((item, index) => (
							<option value={item} key={index} className='uppercase'>
								{item}
							</option>
						))}
					</Select>
				</GridItem>
				<GridItem>
					<Select
						name='metal_quality'
						value={searchParams.get('metal_quality') ?? ''}
						placeholder='Select Quality'
						bgColor={'#FFE5CF'}
						variant={'filled'}
						onChange={(e) => handleChange(e.target.name, e.target.value)}
					>
						{qualities.map((item, index) => (
							<option value={item} key={index} className='uppercase'>
								{item}
							</option>
						))}
					</Select>
				</GridItem>
				<GridItem>
					<Select
						name='diamond_type'
						value={searchParams.get('diamond_type') ?? ''}
						placeholder='Diamond Type'
						hidden={diamond_types.length === 0}
						bgColor={'#FFE5CF'}
						onChange={(e) => handleChange(e.target.name, e.target.value)}
						variant={'filled'}
					>
						{diamond_types.map((item, index) => (
							<option value={item} key={index} className='uppercase'>
								{item}
							</option>
						))}
					</Select>
				</GridItem>
			</Grid>

			{sizes.length > 0 && (
				<>
					<Text marginTop={'0.5rem'}> Select Size</Text>
					<Grid className='grid-cols-1 md:grid-cols-4 gap-3'>
						<GridItem>
							<Select
								name='size'
								value={searchParams.get('size') ?? ''}
								placeholder='Select Color'
								bgColor={'#FFE5CF'}
								variant={'filled'}
								onChange={(e) => handleChange(e.target.name, e.target.value)}
							>
								{sizes.map((item, index) => (
									<option value={item} key={index} className='uppercase'>
										{item}
									</option>
								))}
							</Select>
						</GridItem>
					</Grid>
					<Divider bg='black' className='border !border-black/40 mt-4 ' />
				</>
			)}
		</Box>
	);
}
