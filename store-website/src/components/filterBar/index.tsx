'use client';
import { Box, Flex, Text, VStack, useBoolean } from '@chakra-ui/react';
import { CiFilter } from 'react-icons/ci';
import { FaFilter } from 'react-icons/fa';

export default function FilterBar() {
	const [isFilterExpanded, setFilterExpanded] = useBoolean(false);

	return (
		<>
			<section className=' h-[40px] px-4 w-[96%] bg-[#F0F0F0]  mx-[2%] py-2 rounded-full flex items-center justify-between'>
				<Flex>Hii</Flex>
				<Box cursor={'pointer'} onClick={() => setFilterExpanded.toggle()}>
					{isFilterExpanded ? <FaFilter color='black' /> : <CiFilter />}
				</Box>
			</section>
			<Flex
				hidden={!isFilterExpanded}
				bgColor={'white'}
				width={'96%'}
				mt={'-0.5rem'}
				mx='2%'
				py={'0.5rem'}
				px={'1rem'}
				rounded={'lg'}
				bg='#F0F0F0'
				className='h-[500px]'
			>
				<VStack>
					<Text fontWeight={'medium'}>Pricing</Text>
				</VStack>
				<VStack></VStack>
				<VStack></VStack>
				<VStack></VStack>
			</Flex>
		</>
	);
}
