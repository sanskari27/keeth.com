'use client';
import { cancelOrder } from '@/services/checkout.service';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export type AlertBoxHandle = {
	open: (id: string) => void;
	close: () => void;
};

const AlertBox = forwardRef<AlertBoxHandle>((_, ref) => {
	const toast = useToast();
	const router = useRouter();
	const cancelRef = useRef(null);
	const { isOpen, onClose, onOpen } = useDisclosure();
	const idRef = useRef('');

	useImperativeHandle(ref, () => ({
		close: () => {
			idRef.current = '';
			onClose();
		},
		open: (id: string) => {
			idRef.current = id;
			onOpen();
		},
	}));
	const onOrderCancel = () => {
		const id = idRef.current;
		onClose();
		handleCancel(id);
	};

	const handleCancel = async (id: string) => {
		const success = await cancelOrder(id);
		if (!success) {
			return toast({
				status: 'error',
				title: 'Order cancellation failed.',
				description: 'This order cannot be cancelled',
				position: 'top',
			});
		}
		router.refresh();
	};

	return (
		<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						Cancel Order
					</AlertDialogHeader>

					<AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme='red' onClick={onOrderCancel} ml={3}>
							Cancel
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
});

export default AlertBox;
