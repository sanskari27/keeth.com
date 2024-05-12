import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoSave } from 'react-icons/io5';
import { MdCancelPresentation, MdUpdate } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import ProductService from '../../../services/product.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addProductCodeToGroup,
	addRecommendationGroup,
	removeProductCodeToGroup,
	reset,
	setCreating,
	setRecommendationName,
	setSaving,
	setSelectedProductGroup,
	setUpdating,
	updateRecommendationGroup,
} from '../../../store/reducers/ProductsReducer';
import Each from '../../components/utils/Each';

const ProductGroupDetails = () => {
	const [productCodeSearch, setProductCodeSearch] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	const {
		list,
		selectedProductGroup: { name, productCodes },
		uiDetails: { isCreating, isSaving },
	} = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	const handleCreate = async () => {
		dispatch(setSaving(true));
		const details = await ProductService.createProductGroup({ name, productCodes });
		if (!details) {
			dispatch(setSaving(false));
			return alert('Error Creating Product Recommendations');
		}
		dispatch(addRecommendationGroup(details));

		navigate(NAVIGATION.PRODUCT_GROUP);
		dispatch(setSaving(false));
	};

	const handleUpdate = async () => {
		if (!id) {
			return alert('Something went wrong. Please reload the page.');
		}
		dispatch(setSaving(true));
		const details = await ProductService.updateProductGroup(id, { name, productCodes });
		if (!details) {
			dispatch(setSaving(false));
			return alert('Error Updating Product Recommendations');
		}
		dispatch(updateRecommendationGroup(details));
		navigate(NAVIGATION.PRODUCT_GROUP);
		dispatch(setSaving(false));
	};

	useEffect(() => {
		dispatch(reset());
		if (!id) {
			dispatch(setCreating(true));
			return;
		}
		dispatch(setUpdating(true));
		dispatch(setSelectedProductGroup(id));
	}, [dispatch, id]);

	useEffect(() => {
		pushToNavbar({
			title: 'Create Recommendations',
		});
		return () => {
			popFromNavbar();
		};
	}, []);

	const filtered = list.filter(
		(p) =>
			p.productCode.startsWith(productCodeSearch) ||
			p.price.toString().startsWith(productCodeSearch)
	);

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Create Recommendations Group
					<ButtonGroup alignSelf={'end'}>
						<Button
							variant='outline'
							colorScheme='red'
							leftIcon={<MdCancelPresentation />}
							onClick={() => navigate(NAVIGATION.PRODUCT_GROUP)}
						>
							Discard
						</Button>
						{isCreating ? (
							<Button
								variant='outline'
								colorScheme='green'
								leftIcon={<IoSave />}
								isLoading={isSaving}
								onClick={handleCreate}
							>
								Create
							</Button>
						) : (
							<Button
								variant='outline'
								colorScheme='green'
								leftIcon={<MdUpdate />}
								isLoading={isSaving}
								onClick={handleUpdate}
							>
								Update
							</Button>
						)}
					</ButtonGroup>
				</Flex>
			</Heading>

			<Box marginTop={'1rem'} width={'98%'} pb={'5rem'}>
				<FormControl>
					<FormLabel>Group Name</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						placeholder='Recommendation Group For Rings'
						value={name}
						onChange={(e) => dispatch(setRecommendationName(e.target.value))}
					/>
				</FormControl>

				<Flex justifyContent={'flex-end'} marginTop={'1rem'}>
					<InputGroup size='sm' variant={'outline'} width={'250px'}>
						<InputLeftElement pointerEvents='none'>
							<SearchIcon color='gray.300' />
						</InputLeftElement>
						<Input
							placeholder='Search here...'
							value={productCodeSearch}
							onChange={(e) => setProductCodeSearch(e.target.value)}
							borderRadius={'5px'}
							focusBorderColor='gray.300'
							color={'black'}
						/>
					</InputGroup>
				</Flex>
				<TableContainer pt={'0.5rem'} textColor={'black'}>
					<Table>
						<Thead>
							<Tr>
								<Th color={'gray'} width={'5%'}>
									Sl no
								</Th>
								<Th color={'gray'} width={'10%'}>
									Product Code
								</Th>
								<Th color={'gray'} width={'65%'}>
									Name
								</Th>
								<Th color={'gray'} width={'20%'} isNumeric>
									Price
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(product, index) => (
									<Tr verticalAlign={'middle'} cursor={'pointer'}>
										<Td>
											<Checkbox
												mr={'1rem'}
												isChecked={productCodes.includes(product.productCode)}
												onChange={(e) => {
													if (e.target.checked) {
														dispatch(addProductCodeToGroup(product.productCode));
													} else {
														dispatch(removeProductCodeToGroup(product.productCode));
													}
												}}
												colorScheme='green'
											/>
											{index + 1}.
										</Td>
										<Td>{product.productCode}</Td>
										<Td>{product.name}</Td>
										<Td isNumeric>{product.price}</Td>
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

export default ProductGroupDetails;
