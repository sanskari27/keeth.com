import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Input,
	InputGroup,
	InputLeftAddon,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { Order } from '..';
import CartService from '../../../../services/cart.service';

export type TrackingUpdateDialogHandle = {
	close: () => void;
	open: (order: Order) => void;
};

const TrackingUpdateDialog = forwardRef<TrackingUpdateDialogHandle>((_, ref) => {
	const cancelRef = useRef(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [order, setOrder] = useState({} as Order);
	const [tracking, setTracking] = useState('');

	useImperativeHandle(ref, () => ({
		close: () => {
			onClose();
		},
		open: (order: Order) => {
			setOrder(order);
			onOpen();
		},
	}));

	const handleSave = async () => {
		onClose();
		await CartService.saveTrackingID(order.id, tracking);
	};

	return (
		<AlertDialog
			motionPreset='slideInBottom'
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isOpen={isOpen}
			isCentered
		>
			<AlertDialogOverlay />

			<AlertDialogContent>
				<AlertDialogHeader>Update Tracking Number</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>
					{/* <Input variant='filled' placeholder='Filled' /> */}
					<InputGroup>
						<InputLeftAddon>
							<TbTruckDelivery />
						</InputLeftAddon>
						<Input
							placeholder='eg. EX001100'
							value={tracking}
							onChange={(e) => setTracking(e.target.value)}
						/>
					</InputGroup>
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme='green' isDisabled={!tracking} ml={3} onClick={handleSave}>
						Save
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

export default TrackingUpdateDialog;
