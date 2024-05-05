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
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaSitemap } from 'react-icons/fa6';
import { MdOutlineCreate } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import ProductService from '../../../services/product.service';
import { StoreNames, StoreState } from '../../../store';
import { updateBestSeller } from '../../../store/reducers/ProductsReducer';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';

const Products = () => {
	const outlet = useOutlet();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { list } = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	const openProduct = (productCode: string) => {
		navigate(`${NAVIGATION.PRODUCT}/${productCode}`);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Products',
			icon: FaSitemap,
			link: NAVIGATION.PRODUCT,
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

	const filtered = useFilteredList(list, { name: 1, productCode: 1 });

	async function handleBestSeller(code: string, checked: boolean) {
		const success = await ProductService.updateBestSeller(code, checked);
		if (success) {
			dispatch(updateBestSeller({ productCode: code, isBestSeller: checked }));
		}
	}

	if (outlet) {
		return outlet;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Products
					<Link to={NAVIGATION.PRODUCT + '/new'}>
						<Button
							variant='outline'
							size={'sm'}
							colorScheme='green'
							leftIcon={<MdOutlineCreate />}
						>
							Add Product
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
									Product Code
								</Th>
								<Th color={'gray'} width={'60%'}>
									Name
								</Th>
								<Th color={'gray'} width={'10%'} isNumeric>
									Price
								</Th>
								<Th color={'gray'} width={'5%'} isNumeric>
									Best Seller
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(product, index) => (
									<Tr verticalAlign={'middle'} cursor={'pointer'}>
										<Td onClick={() => openProduct(product.productCode)}>{index + 1}.</Td>
										<Td onClick={() => openProduct(product.productCode)}>{product.productCode}</Td>
										<Td
											onClick={() => openProduct(product.productCode)}
											className='whitespace-break-spaces'
										>
											{product.name}
										</Td>
										<Td onClick={() => openProduct(product.productCode)} isNumeric>
											{product.price}
										</Td>
										<Td width={'5%'} isNumeric>
											<Switch
												isChecked={product.isBestSeller}
												onChange={(e) => handleBestSeller(product.productCode, e.target.checked)}
											/>
										</Td>
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

export default Products;
