import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoBagHandle } from 'react-icons/io5';
import { useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import CartService from '../../../services/cart.service';
import Loading from '../../components/loading';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';
import DateFilter from './components/DateFilter';
import StatusUpdateDialog, { StatusUpdateDialogHandle } from './components/StatusUpdateDialog';
import TrackingUpdateDialog, {
	TrackingUpdateDialogHandle,
} from './components/TrackingNumberDialog';

export type Order = {
	id: string;
	name: string;
	phone: string;
	email: string;
	quantity: number;
	amount: number;
	couponCode: string;
	payment_method: string;
	status: string;
	order_status:
		| 'payment-pending'
		| 'placed'
		| 'cancelled'
		| 'shipped'
		| 'delivered'
		| 'return-raised'
		| 'return-accepted'
		| 'return-denied'
		| 'return-initiated'
		| 'refund-initiated'
		| 'refund-completed';
	transaction_date: string;
};

const Orders = () => {
	const navigate = useNavigate();
	const outlet = useOutlet();
	const [loading, setLoading] = useState(true);

	const statusUpdateRef = useRef<StatusUpdateDialogHandle>(null);
	const trackingUpdateRef = useRef<TrackingUpdateDialogHandle>(null);

	const [list, setList] = useState<Order[]>([]);

	const fetchOrders = useCallback(() => {
		CartService.getOrders()
			.then(setList)
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		setLoading(true);
		fetchOrders();
	}, [fetchOrders]);

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

	const handleDateRange = (startDate: Date, endDate: Date) => {
		setLoading(true);
		CartService.getOrders({ startDate, endDate })
			.then(setList)
			.finally(() => setLoading(false));
	};

	const filtered = useFilteredList(list, { name: 1, email: 1, phone: 1, order_status: 1 });

	const handleAction = async (
		order: Order,
		action:
			| 'accept-return'
			| 'reject-return'
			| 'order-status'
			| 'tracking-number'
			| 'payment-complete'
	) => {
		if (action === 'accept-return') {
			const success = await CartService.acceptReturn(order.id);
			if (success) {
				fetchOrders();
			}
		} else if (action === 'reject-return') {
			const success = await CartService.rejectReturn(order.id);
			if (success) {
				fetchOrders();
			}
		} else if (action === 'order-status') {
			statusUpdateRef.current?.open(order);
		} else if (action === 'tracking-number') {
			trackingUpdateRef.current?.open(order);
		} else if (action === 'payment-complete') {
			const success = await CartService.markPaid(order.id);
			if (success) {
				fetchOrders();
			}
		}
	};

	if (outlet) {
		return outlet;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'} minH={'100vh'}>
			<Loading isLoaded={!loading} />

			<Box width={'98%'} pb={'5rem'}>
				<Flex justifyContent={'flex-end'}>
					<Text color={'black'}>{list.length} records found.</Text>
					<Box position={'relative'} mx={'0.5rem'}>
						<DateFilter onConfirm={handleDateRange} />
					</Box>
				</Flex>

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
								<Th color={'gray'} width={'15%'}>
									Payment Status
								</Th>
								<Th color={'gray'} width={'10%'}>
									Status
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Quantity
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Amount
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Action
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(order, index) => (
									<Tr verticalAlign={'middle'}>
										<Td>{index + 1}.</Td>
										<Td>{order.transaction_date}</Td>
										<Td>{order.name}</Td>
										<Td>
											<HStack>
												<Text textTransform={'uppercase'}>{order.payment_method}</Text>
												<Text className='mx-1'>:</Text>
												<Text textTransform={'capitalize'}>{order.status}</Text>
											</HStack>
										</Td>
										<Td textTransform={'capitalize'}>{order.order_status.replace('-', ' ')}</Td>
										<Td isNumeric>{order.quantity}</Td>
										<Td isNumeric>{order.amount}</Td>
										<Td isNumeric>
											<Menu>
												<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
													Actions
												</MenuButton>
												<MenuList>
													<MenuItem onClick={() => openOrder(order)}>Details</MenuItem>
													{order.order_status === 'return-raised' ? (
														<>
															<MenuItem onClick={() => handleAction(order, 'accept-return')}>
																Accept Return
															</MenuItem>
															<MenuItem onClick={() => handleAction(order, 'reject-return')}>
																Reject Return
															</MenuItem>
														</>
													) : (
														<MenuItem onClick={() => handleAction(order, 'order-status')}>
															Update Order Status
														</MenuItem>
													)}
													{order.order_status === 'shipped' ||
													order.order_status === 'return-initiated' ? (
														<>
															<MenuItem onClick={() => handleAction(order, 'tracking-number')}>
																Tracking No.
															</MenuItem>
														</>
													) : null}
													{order.payment_method === 'cod' ? (
														<>
															<MenuItem onClick={() => handleAction(order, 'payment-complete')}>
																Mark COD Paid
															</MenuItem>
														</>
													) : null}
												</MenuList>
											</Menu>
										</Td>
									</Tr>
								)}
							/>
						</Tbody>
					</Table>
				</TableContainer>
				<StatusUpdateDialog ref={statusUpdateRef} onUpdate={fetchOrders} />
				<TrackingUpdateDialog ref={trackingUpdateRef} />
			</Box>
		</Flex>
	);
};

export default Orders;
