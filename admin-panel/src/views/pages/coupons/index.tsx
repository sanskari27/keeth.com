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
import { IoTicket } from 'react-icons/io5';
import { MdOutlineCreate } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import { StoreNames, StoreState } from '../../../store';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';

const Coupons = () => {
	const outlet = useOutlet();
	const navigate = useNavigate();

	const { list } = useSelector((state: StoreState) => state[StoreNames.COUPONS]);

	const openCoupon = (id: string) => {
		navigate(`${NAVIGATION.COUPONS}/${id}`);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Coupons',
			icon: IoTicket,
			link: NAVIGATION.COUPONS,
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

	const filtered = useFilteredList(list, { name: 1, couponCode: 1 });

	if (outlet) {
		return outlet;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Coupons
					<Link to={NAVIGATION.COUPONS + '/new'}>
						<Button
							variant='outline'
							size={'sm'}
							colorScheme='green'
							leftIcon={<MdOutlineCreate />}
						>
							Create Coupon
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
								<Th color={'gray'} width={'35%'}>
									Name
								</Th>
								<Th color={'gray'} width={'20%'}>
									Code
								</Th>
								<Th color={'gray'} width={'20%'} isNumeric>
									Discount
								</Th>
								<Th color={'gray'} width={'20%'} isNumeric>
									Available Coupons
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(coupon, index) => (
									<Tr
										verticalAlign={'middle'}
										cursor={'pointer'}
										onClick={() => openCoupon(coupon.id)}
									>
										<Td>{index + 1}.</Td>
										<Td>{coupon.name}</Td>
										<Td>{coupon.couponCode}</Td>
										<Td isNumeric>
											{coupon.discountType === 'amount'
												? `₹${coupon.discountAmount}`
												: `${coupon.discountPercentage}%`}
										</Td>
										<Td isNumeric>{coupon.availableCoupon}</Td>
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

export default Coupons;
