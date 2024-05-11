import {
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Switch,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { MdOutlineCreate, MdOutlineEventAvailable } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import ProductService from '../../../services/product.service';
import { StoreNames, StoreState } from '../../../store';
import {
	setCustomizations,
	setFetching,
	updateVisibility,
} from '../../../store/reducers/ProductsReducer';
import { ProductDetails } from '../../../store/types/ProductsState';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import Each from '../../components/utils/Each';

const ProductCustomizations = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const confirmRef = useRef<DeleteAlertHandle>(null);
	const { productCode } = useParams();

	const { customizations } = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	useEffect(() => {
		if (!productCode) {
			return;
		}
		dispatch(setFetching(true));
		dispatch(setCustomizations([]));
		ProductService.listCustomizations(productCode)
			.then((products) => dispatch(setCustomizations(products)))
			.finally(() => {
				dispatch(setFetching(false));
			});
	}, [dispatch, productCode]);

	useEffect(() => {
		pushToNavbar({
			title: 'Customizations',
		});
		return () => {
			popFromNavbar();
		};
	}, []);

	const handleAllUnavailable = () => {
		for (const c of customizations) {
			handleAvailable(c.id, false);
		}
	};

	const openProduct = (product: ProductDetails) => {
		navigate(`${NAVIGATION.PRODUCT}/${product.productCode}/edit/${product.id}`);
	};

	async function handleAvailable(id: string, checked: boolean) {
		const success = await ProductService.updateListing(id, checked);
		if (success) {
			dispatch(updateVisibility({ id, visible: checked }));
		}
	}

	if (!productCode) {
		return <Navigate to={NAVIGATION.PRODUCT} />;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Customizations
					<HStack gap={'0.5rem'} alignItems={'flex-end'} justifyContent={'space-between'}>
						<Button
							variant='outline'
							size={'sm'}
							colorScheme='red'
							leftIcon={<MdOutlineEventAvailable />}
							onClick={() => confirmRef.current?.open()}
						>
							Mark Unavailable
						</Button>
						<Link
							to={`${NAVIGATION.PRODUCT}/${productCode}/edit?${
								customizations.length > 0 ? `clone_product_id=${customizations[0].id}` : ''
							}`}
						>
							<Button
								variant='outline'
								size={'sm'}
								colorScheme='green'
								leftIcon={<MdOutlineCreate />}
							>
								Add Customization
							</Button>
						</Link>
					</HStack>
				</Flex>
			</Heading>

			<Box marginTop={'1rem'} width={'98%'} pb={'5rem'}>
				<TableContainer pt={'0.5rem'} textColor={'black'}>
					<Table>
						<Thead>
							<Tr>
								<Th color={'gray'} width={'5%'}>
									Sl no
								</Th>
								<Th color={'gray'} width={'45%'}>
									Name
								</Th>
								<Th color={'gray'} width={'7%'}>
									Metal Type
								</Th>
								<Th color={'gray'} width={'7%'}>
									Metal Color
								</Th>
								<Th color={'gray'} width={'7%'}>
									Metal Purity
								</Th>
								<Th color={'gray'} width={'7%'}>
									Diamond Type
								</Th>
								<Th color={'gray'} width={'7%'}>
									Size
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Price
								</Th>
								<Th color={'gray'} width={'5%'} isNumeric>
									Available
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={customizations}
								render={(product, index) => (
									<Tr verticalAlign={'middle'} cursor={'pointer'}>
										<Td width={'5%'} onClick={() => openProduct(product)}>
											{index + 1}.
										</Td>
										<Td width={'45%'} onClick={() => openProduct(product)}>
											{product.name}
										</Td>
										<Td width={'7%'} onClick={() => openProduct(product)}>
											{product.metal_type}
										</Td>
										<Td width={'7%'} onClick={() => openProduct(product)}>
											{product.metal_color}
										</Td>
										<Td width={'7%'} onClick={() => openProduct(product)}>
											{product.metal_quality}
										</Td>
										<Td width={'7%'} onClick={() => openProduct(product)}>
											{product.diamond_type}
										</Td>
										<Td width={'7%'} onClick={() => openProduct(product)}>
											{product.size}
										</Td>
										<Td width={'10%'} isNumeric onClick={() => openProduct(product)}>
											{product.price}
										</Td>
										<Td width={'5%'} isNumeric>
											<Switch
												isChecked={!product.discontinued}
												onChange={(e) => handleAvailable(product.id, e.target.checked)}
											/>
										</Td>
									</Tr>
								)}
							/>
						</Tbody>
					</Table>
				</TableContainer>
				<DeleteAlert type='All Customization' ref={confirmRef} onConfirm={handleAllUnavailable} />
			</Box>
		</Flex>
	);
};

export default ProductCustomizations;
