import { DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import {
	As,
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { setNavbarSearchText, useNavbar } from '../../../hooks/useNavbar';

export default function Navbar() {
	const navigate = useNavigate();

	const { locations } = useNavbar();

	return (
		<Flex
			justifyContent={'space-between'}
			alignItems={'center'}
			position={'fixed'}
			top={0}
			left={'70px'}
			width={'calc(100% - 70px)'}
			height={'calc(50px + 0.75rem)'}
			borderBottomWidth={'thin'}
			borderBottomColor={'gray.300'}
			paddingY={'0.75rem'}
			paddingX={'0.75rem'}
			zIndex={99}
			background={'white'}
		>
			<Flex alignItems={'center'}>
				<Box>
					<Breadcrumb
						fontSize={'lg'}
						fontWeight='medium'
						textDecoration={'none'}
						className='hover:no-underline'
						color={'black'}
					>
						{locations.map((loc, index) => {
							return (
								<BreadcrumbItem key={index}>
									<BreadcrumbLink
										as={Box}
										textDecoration={'none'}
										isCurrentPage={index === locations.length - 1}
										onClick={() => loc.link && navigate(loc.link)}
									>
										<Flex alignItems={'center'}>
											{loc.icon ? (
												<Icon
													as={loc.icon as As | undefined}
													height={5}
													width={5}
													color={'green.400'}
													mr={'0.5rem'}
												/>
											) : null}
											<Text fontSize={'xl'}>{loc.title}</Text>
										</Flex>
									</BreadcrumbLink>
								</BreadcrumbItem>
							);
						})}
					</Breadcrumb>
				</Box>
			</Flex>
			<Flex alignItems={'center'}>
				{locations.length > 0 ? locations[locations.length - 1].actions : null}
			</Flex>
		</Flex>
	);
}

export function NavbarSearchElement() {
	const { searchText } = useNavbar();

	return (
		<InputGroup size='sm' variant={'outline'} width={'250px'}>
			<InputLeftElement pointerEvents='none'>
				<SearchIcon color='gray.300' />
			</InputLeftElement>
			<Input
				placeholder='Search here...'
				value={searchText}
				onChange={(e) => setNavbarSearchText(e.target.value)}
				borderRadius={'5px'}
				focusBorderColor='gray.300'
				color={'black'}
			/>
		</InputGroup>
	);
}
export function NavbarDeleteElement({
	isLoading = false,
	isDisabled,
	onClick,
}: {
	isLoading?: boolean;
	isDisabled: boolean;
	onClick: () => void;
}) {
	return (
		<IconButton
			aria-label='delete'
			isDisabled={isDisabled}
			icon={<Icon as={DeleteIcon} height={4} width={4} />}
			colorScheme={'red'}
			size={'sm'}
			isLoading={isLoading}
			onClick={onClick}
		/>
	);
}
