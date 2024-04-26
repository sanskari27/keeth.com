import {
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaSitemap } from 'react-icons/fa6';
import { MdOutlineCreate } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import { StoreNames, StoreState } from '../../../store';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';

const ProductGroups = () => {
	const outlet = useOutlet();
	const navigate = useNavigate();

	const { productGroups } = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	const openProductGroup = (id: string) => {
		navigate(`${NAVIGATION.PRODUCT_GROUP}/${id}`);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Recommendation Groups',
			icon: FaSitemap,
			link: NAVIGATION.PRODUCT_GROUP,
			actions: (
				<HStack>
					<NavbarSearchElement />
				</HStack>
			),
		});
		return () => {
			popFromNavbar();
		};
	}, []);

	const filtered = useFilteredList(productGroups, { name: 1 });

	if (outlet) {
		return outlet;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Recommendation Groups
					<Link to={NAVIGATION.PRODUCT_GROUP + '/new'}>
						<Button
							variant='outline'
							size={'sm'}
							colorScheme='green'
							leftIcon={<MdOutlineCreate />}
						>
							Create Recommendation
						</Button>
					</Link>
				</Flex>
			</Heading>

			<Box marginTop={'1rem'} width={'98%'} pb={'5rem'}>
				<Text textAlign={'right'} color={'black'}>
					{filtered.length} records found.
				</Text>

				<TableContainer pt={'0.5rem'} textColor={'black'}>
					<Table>
						<Thead>
							<Tr>
								<Th color={'gray'} width={'5%'}>
									Sl no
								</Th>
								<Th color={'gray'} width={'20%'}>
									Group Name
								</Th>
								<Th color={'gray'} width={'75%'}>
									Product Codes
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(group, index) => (
									<Tr
										verticalAlign={'middle'}
										cursor={'pointer'}
										onClick={() => openProductGroup(group.id)}
									>
										<Td>{index + 1}.</Td>
										<Td>{group.name}</Td>
										<Td className='whitespace-break-spaces'>{group.productCodes.join(', ')}</Td>
									</Tr>
								)}
							/>
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</Flex>
	);
};

export default ProductGroups;
