import { Box, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import CartService from '../../../services/cart.service';
import Loading from '../../components/loading';
import Each from '../../components/utils/Each';
import CartDetailsModal, { CartDetailsDialogHandle } from './CartDetailsModal';

export type Cart = {
	id: string;
	user: {
		name: string;
		phone: string;
		email: string;
	};
	cartItems: {
		product_id: string;
		quantity: number;
		productCode: string;
		name: string;
		metal_type: string;
		metal_color: string;
		metal_quality: string;
		diamond_type: string;
		size: string;
		price: number;
		discount: number;
	}[];
	grossAmount: number;
};

const Carts = () => {
	const cartDetailsDialog = useRef<CartDetailsDialogHandle>(null);

	const [loading, setLoading] = useState(true);

	const [list, setList] = useState<Cart[]>([]);

	useEffect(() => {
		setLoading(true);
		CartService.abandonedCarts()
			.then(setList)
			.finally(() => setLoading(false));
	}, []);

	const openAbandonedCart = (cart: Cart) => {
		cartDetailsDialog.current?.open(cart);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Abandoned Carts',
			icon: FaCartShopping,
		});
		return () => {
			popFromNavbar();
		};
	}, []);

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
								<Th color={'gray'} width={'25%'}>
									Name
								</Th>
								<Th color={'gray'} width={'25%'}>
									Phone
								</Th>
								<Th color={'gray'} width={'25%'}>
									Email
								</Th>
								<Th color={'gray'} width={'20%'} isNumeric>
									Amount
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={list}
								render={(cart, index) => (
									<Tr
										verticalAlign={'middle'}
										cursor={'pointer'}
										onClick={() => openAbandonedCart(cart)}
									>
										<Td>{index + 1}.</Td>
										<Td>{cart.user.name}</Td>
										<Td>{cart.user.phone}</Td>
										<Td>{cart.user.email}</Td>
										<Td isNumeric>{cart.grossAmount}</Td>
									</Tr>
								)}
							/>
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
			<CartDetailsModal ref={cartDetailsDialog} />
		</Flex>
	);
};

export default Carts;
