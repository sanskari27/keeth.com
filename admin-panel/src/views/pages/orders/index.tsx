import {
	Box,
	Flex,
	HStack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoBagHandle } from 'react-icons/io5';
import { useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import CartService from '../../../services/cart.service';
import Loading from '../../components/loading';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';

export type Order = {
	id: string;
	name: string;
	phone: string;
	email: string;
	quantity: number;
	amount: number;
	couponCode: string;
	status: string;
	transaction_date: string;
};

const Orders = () => {
	const navigate = useNavigate();
	const outlet = useOutlet();
	const [loading, setLoading] = useState(true);

	const [list, setList] = useState<Order[]>([]);

	useEffect(() => {
		setLoading(true);
		CartService.getOrders()
			.then(setList)
			.finally(() => setLoading(false));
	}, []);

	const openOrder = (order: Order) => {
		navigate(`${NAVIGATION.ORDERS}/${order.id}`);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Orders',
			icon: IoBagHandle,
			link: NAVIGATION.ORDERS,
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

	const filtered = useFilteredList(list, { name: 1, email: 1, phone: 1, status: 1 });

	if (outlet) {
		return outlet;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Loading isLoaded={!loading} />

			<Box width={'98%'} pb={'5rem'}>
				<Text textAlign={'right'} color={'black'}>
					{list.length} records found.
				</Text>

				<TableContainer pt={'0.5rem'} textColor={'black'}>
					<Table>
						<Thead>
							<Tr>
								<Th color={'gray'} width={'5%'}>
									Sl no
								</Th>
								<Th color={'gray'} width={'15%'}>
									Date
								</Th>
								<Th color={'gray'} width={'20%'}>
									Name
								</Th>
								<Th color={'gray'} width={'20%'}>
									Phone
								</Th>

								<Th color={'gray'} width={'10%'}>
									Status
								</Th>
								<Th color={'gray'} width={'10%'}>
									Coupon
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Quantity
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Amount
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(order, index) => (
									<Tr verticalAlign={'middle'} cursor={'pointer'} onClick={() => openOrder(order)}>
										<Td>{index + 1}.</Td>
										<Td>{order.transaction_date}</Td>
										<Td>{order.name}</Td>
										<Td>{order.phone}</Td>
										<Td>{order.status}</Td>
										<Td>{order.couponCode}</Td>
										<Td isNumeric>{order.quantity}</Td>
										<Td isNumeric>{order.amount}</Td>
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

export default Orders;
