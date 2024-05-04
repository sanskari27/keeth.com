import { Box, CloseButton, Icon, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { BsFillCalendarDateFill } from 'react-icons/bs';

export default function DateFilter({ onConfirm }: { onConfirm: (start: Date, end: Date) => void }) {
	const { isOpen, onToggle, onClose } = useDisclosure();
	const [filterDateStart, setFilterDateStart] = useState(new Date('01/01/2023'));
	const [filterDateEnd, setFilterDateEnd] = useState(new Date());

	const selectionRange = {
		startDate: filterDateStart,
		endDate: filterDateEnd,
		key: 'selection',
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSelect = (ranges: any) => {
		if ('selection' in ranges) {
			const selection = ranges.selection as {
				startDate: Date;
				endDate: Date;
			};
			setFilterDateStart(selection.startDate);
			setFilterDateEnd(selection.endDate);
			onConfirm(selection.startDate, selection.endDate);
			onClose();
		}
	};
	return (
		<Box position={'relative'}>
			{isOpen ? (
				<CloseButton onClick={onClose} color={'black'} />
			) : (
				<Icon
					as={BsFillCalendarDateFill}
					width='24px'
					height='24px'
					cursor={'pointer'}
					onClick={onToggle}
					color={'black'}
				/>
			)}

			<Box
				hidden={!isOpen}
				right={'150px'}
				top={'30px'}
				position={'absolute'}
				padding={'1rem'}
				bgColor={'#F7FCFA'}
				rounded={'lg'}
				shadow={'lg'}
			>
				<DateRangePicker ranges={[selectionRange]} onChange={handleSelect} color='red' />
			</Box>
		</Box>
	);
}
