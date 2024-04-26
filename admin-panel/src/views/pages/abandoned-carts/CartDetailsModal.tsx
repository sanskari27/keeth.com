import {
	Box,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '.';
import { NAVIGATION } from '../../../config/const';
import Loading from '../../components/loading';
import Each from '../../components/utils/Each';

export type CartDetailsDialogHandle = {
	open: (cart: Cart) => void;
	close: () => void;
};

const CartDetailsModal = forwardRef<CartDetailsDialogHandle>((_, ref) => {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [state, setState] = useState<Cart | null>(null);

	const openProduct = (productCode: string, id: string) => {
		navigate(`${NAVIGATION.PRODUCT}/${productCode}/edit/${id}`);
	};

	useImperativeHandle(ref, () => ({
		open: (cart: Cart) => {
			setState(cart);
			onOpen();
		},
		close: () => onClose(),
	}));

	if (!state) {
		return <Loading isLoaded={!isOpen || false} />;
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>Cart Details</ModalHeader>
				<ModalBody>
					<HStack alignItems={'center'}>
						<Text width='100px'>Name</Text>
						<Text fontWeight={'medium'}>{state.user.name || 'N/A'}</Text>
					</HStack>
					<HStack alignItems={'center'} marginTop={'0.5rem'}>
						<Text width='100px'>Phone</Text>
						<Text fontWeight={'medium'}>{state.user.phone || 'N/A'}</Text>
					</HStack>
					<HStack alignItems={'center'} marginTop={'0.5rem'}>
						<Text width='100px'>Email</Text>
						<Text fontWeight={'medium'}>{state.user.email || 'N/A'}</Text>
					</HStack>

					<Box marginTop={'1rem'} width={'98%'} pb={'5rem'}>
						<TableContainer pt={'0.5rem'} textColor={'black'}>
							<Table>
								<Thead>
									<Tr>
										<Th color={'gray'} width={'15%'}>
											Product Code
										</Th>
										<Th color={'gray'} width={'40%'}>
											Product Name
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
									</Tr>
								</Thead>
								<Tbody>
									<Each
										items={state.cartItems}
										render={(product) => (
											<Tr
												verticalAlign={'middle'}
												cursor={'pointer'}
												onClick={() => openProduct(product.productCode, product.product_id)}
											>
												<Td width={'15%'}>{product.productCode}</Td>
												<Td width={'40%'}>{product.name}</Td>
												<Td width={'7%'}>{product.metal_type}</Td>
												<Td width={'7%'}>{product.metal_color}</Td>
												<Td width={'7%'}>{product.metal_quality}</Td>
												<Td width={'7%'}>{product.diamond_type}</Td>
												<Td width={'7%'}>{product.size}</Td>
												<Td width={'10%'} isNumeric>
													{product.price}
												</Td>
											</Tr>
										)}
									/>
								</Tbody>
							</Table>
						</TableContainer>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default CartDetailsModal;
