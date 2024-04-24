import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { editSelected } from '../../../store/reducers/CollectionsReducer';

export default function EditCollection() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id: collection_id } = useParams();

	const onClose = useCallback(() => {
		dispatch(editSelected('new'));
		navigate(NAVIGATION.COLLECTIONS);
	}, [dispatch, navigate]);

	useEffect(() => {
		dispatch(editSelected(collection_id ?? 'new'));
	}, [collection_id, dispatch]);

	const onSave = () => {
		console.log('Saved');
		onClose();
	};

	return (
		<Modal isCentered isOpen={true} onClose={onClose} size='4xl'>
			<ModalOverlay bg='blackAlpha.600' backdropFilter='blur(5px)' />

			<ModalContent>
				<ModalHeader />
				<ModalCloseButton />
				<ModalBody>{collection_id}</ModalBody>
				<ModalFooter justifyContent={'center'}>
					<Button
						// isDisabled={isDisabled()}
						onClick={onSave}
						paddingX={'40px'}
						bgColor='blue.400'
						_hover={{
							bgColor: 'blue.500',
						}}
						color='white'
					>
						SAVE
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
