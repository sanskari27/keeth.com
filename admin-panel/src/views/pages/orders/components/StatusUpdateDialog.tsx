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
	Select,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Order } from '..';
import CartService from '../../../../services/cart.service';

export type StatusUpdateDialogHandle = {
	close: () => void;
	open: (order: Order) => void;
};
type StatusUpdateDialogProps = {
	onUpdate: () => void;
};

const StatusUpdateDialog = forwardRef<StatusUpdateDialogHandle, StatusUpdateDialogProps>(
	({ onUpdate }: StatusUpdateDialogProps, ref) => {
		const cancelRef = useRef(null);
		const toast = useToast({ position: 'top', status: 'error' });
		const { isOpen, onOpen, onClose } = useDisclosure();
		const [order, setOrder] = useState({} as Order);
		const [status, setStatus] = useState('');
		const [refundAmount, setRefundAmount] = useState('');

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
			if (order.order_status === 'return-initiated') {
				const success = await CartService.initiateRefund(order.id, Number(refundAmount));
				if (success) {
					onUpdate();
				} else {
					toast({
						title: 'Error updating tracking status.',
					});
				}
			} else {
				const success = await CartService.updateTrackingStatus(order.id, status);
				if (success) {
					onUpdate();
				} else {
					toast({
						title: 'Error updating tracking status.',
					});
				}
			}
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
					<AlertDialogHeader>Update Order Status</AlertDialogHeader>
					<AlertDialogCloseButton />
					<AlertDialogBody>
						<Select
							placeholder='Select Status'
							value={status}
							onChange={(e) => setStatus(e.target.value)}
						>
							{order.order_status === 'placed' ? (
								<>
									<option value='cancelled'>Cancel Order</option>
									<option value='shipped'>Shipped</option>
								</>
							) : order.order_status === 'shipped' ? (
								<>
									<option value='placed'>Placed (Not Shipped)</option>
									<option value='delivered'>Delivered</option>
								</>
							) : order.order_status === 'return-accepted' ? (
								<>
									<option value='return-initiated'>Return Initiated</option>
								</>
							) : order.order_status === 'return-initiated' ? (
								<>
									<option value='refund-initiated'>Refund Initiated</option>
								</>
							) : order.order_status === 'refund-initiated' ? (
								<>
									<option value='refund-completed'>Refund Completed</option>
								</>
							) : null}
						</Select>
						<InputGroup
							variant={'outline'}
							marginTop={'1rem'}
							hidden={order.order_status !== 'return-initiated'}
						>
							<InputLeftAddon pointerEvents='none'>₹</InputLeftAddon>
							<Input
								placeholder='Refund Amount'
								value={refundAmount}
								onChange={(e) => setRefundAmount(e.target.value)}
							/>
						</InputGroup>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme='green' isDisabled={!status} ml={3} onClick={handleSave}>
							Save
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}
);

export default StatusUpdateDialog;
