import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Flex,
	Heading,
	Image,
	Stack,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION, SERVER_URL } from '../../../../config/const';
import { popFromNavbar, pushToNavbar } from '../../../../hooks/useNavbar';
import CartService from '../../../../services/cart.service';
import { reset } from '../../../../store/reducers/CollectionsReducer';
import Loading from '../../../components/loading';

export type OrderDetails = {
	id: string;
	name: string;
	email: string;
	phone: string;
	amount: number;
	gross_amount: number;
	discount: number;
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
		| 'return-completed';
	transaction_date: string;
	tracking_number: string;
	return_tracking_number: string;
	payment_method: 'cod' | 'prepaid';
	products: {
		product_id: string;
		productCode: string;
		quantity: number;
		name: string;
		price: number;
		discount: number;
		size: string;
		metal_type: string;
		metal_color: string;
		metal_quality: string;
		diamond_type: string;
	}[];
};

export default function OrderDetails() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const toast = useToast();
	const { id } = useParams();
	const [state, setState] = useState<OrderDetails | null>(null);

	useEffect(() => {
		return () => {
			dispatch(reset());
		};
	}, [dispatch]);

	useEffect(() => {
		if (!id) {
			return navigate(NAVIGATION.ORDERS);
		}

		CartService.getOrderDetails(id)
			.then(setState)
			.catch(() => {
				toast({
					status: 'error',
					title: 'Error fetching order details.',
					position: 'top',
				});
				navigate(NAVIGATION.ORDERS);
			});
	}, [dispatch, id, navigate, toast]);

	useEffect(() => {
		pushToNavbar({
			title: 'Order Details',
		});
		return () => {
			popFromNavbar();
		};
	}, []);

	if (!state) {
		return <Loading isLoaded={false} />;
	}

	return (
		<>
			<Box px={'2%'} pb={'4%'}>
				<Box>
					<Text fontWeight={'bold'} fontSize={'2xl'}>
						Customer Details
					</Text>
					<Flex direction={'column'} border={'1px grey solid'} p={'1rem'} rounded={'2xl'} gap={2}>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Name :-</Text>
							<Text fontWeight={'medium'}>{state.name}</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Email :-</Text>
							<Text fontWeight={'medium'}>{state.email}</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'}>
							<Text>Phone :-</Text>
							<Text fontWeight={'medium'}>{state.phone}</Text>
						</Flex>
					</Flex>
				</Box>
				<Box marginTop={'1rem'}>
					<Text fontWeight={'bold'} fontSize={'2xl'}>
						Order Details
					</Text>
					<Flex direction={'column'} border={'1px grey solid'} p={'1rem'} rounded={'2xl'} gap={2}>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Gross Amount :-</Text>
							<Text fontWeight={'medium'}>₹ {state.gross_amount}</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Discount :-</Text>
							<Text fontWeight={'medium'}>₹ {state.discount}</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Total Amount :-</Text>
							<Text fontWeight={'medium'}>₹ {state.amount}</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Payment Status :-</Text>
							<Text fontWeight={'medium'} textTransform={'capitalize'}>
								{state.status}
							</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Payment Method :-</Text>
							<Text fontWeight={'medium'} textTransform={'uppercase'}>
								{state.payment_method}
							</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Order Status :-</Text>
							<Text fontWeight={'medium'} textTransform={'capitalize'}>
								{state.order_status.replace('-', ' ')}
							</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Order Date :-</Text>
							<Text fontWeight={'medium'} textTransform={'capitalize'}>
								{state.transaction_date}
							</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Order Tracking No. :-</Text>
							<Text fontWeight={'medium'} textTransform={'capitalize'}>
								{state.tracking_number}
							</Text>
						</Flex>
						<Flex gap={3} justifyContent={'space-between'} borderBottom={'1px grey dashed'}>
							<Text>Return Tracking No. (if returned):-</Text>
							<Text fontWeight={'medium'} textTransform={'capitalize'}>
								{state.return_tracking_number}
							</Text>
						</Flex>
					</Flex>
				</Box>
				<Box marginTop={'1rem'}>
					<Text fontWeight={'bold'} fontSize={'2xl'}>
						Products
					</Text>
					<Flex gap={3} direction={'column'}>
						{state.products.map((product, index) => (
							<ProductCard product={product} key={index} />
						))}
					</Flex>
				</Box>
			</Box>
		</>
	);
}

function ProductCard({
	product,
}: {
	product: {
		product_id: string;
		productCode: string;
		quantity: number;
		name: string;
		price: number;
		discount: number;
		size: string;
		metal_type: string;
		metal_color: string;
		metal_quality: string;
		diamond_type: string;
	};
}) {
	const navigate = useNavigate();

	const openProduct = () => {
		navigate(`${NAVIGATION.PRODUCT}/${product.productCode}/edit/${product.product_id}`);
	};

	return (
		<Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline'>
			<Image
				objectFit='cover'
				height={'400px'}
				aspectRatio={1 / 1}
				src={`${SERVER_URL}products/${product.product_id}/image`}
				alt='Product Image'
			/>

			<Stack>
				<CardBody>
					<Heading size='md'>{product.name}</Heading>

					<Flex direction={'column'} gap={'0.25rem'} mt={'1rem'}>
						<Flex gap={'0.5rem'}>
							<Text>Quantity :- </Text>
							<Text fontWeight={'medium'}>{product.quantity}</Text>
						</Flex>
						<Flex gap={'0.5rem'}>
							<Text>Metal Type :- </Text>
							<Text fontWeight={'medium'}>{product.metal_type}</Text>
						</Flex>
						<Flex gap={'0.5rem'}>
							<Text>Metal Color :- </Text>
							<Text fontWeight={'medium'}>{product.metal_color}</Text>
						</Flex>
						<Flex gap={'0.5rem'}>
							<Text>Metal Quality :- </Text>
							<Text fontWeight={'medium'}>{product.metal_quality}</Text>
						</Flex>
						<Flex gap={'0.5rem'}>
							<Text>Diamond Type :- </Text>
							<Text fontWeight={'medium'}>{product.diamond_type}</Text>
						</Flex>
						<Flex gap={'0.5rem'}>
							<Text>Size :- </Text>
							<Text fontWeight={'medium'}>{product.size}</Text>
						</Flex>
					</Flex>
					<Flex direction={'column'} mt={'1rem'}>
						<Flex gap={'0.5rem'}>
							<Text>Price :- </Text>
							<Text fontWeight={'medium'}>{product.price}</Text>
						</Flex>
						<Flex gap={'0.5rem'}>
							<Text>Discount :- </Text>
							<Text fontWeight={'medium'}>{product.discount}</Text>
						</Flex>
					</Flex>
				</CardBody>

				<CardFooter>
					<Button variant='solid' colorScheme='blue' onClick={openProduct}>
						Open Product
					</Button>
				</CardFooter>
			</Stack>
		</Card>
	);
}
