import {
	Box,
	Flex,
	HStack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaUserTag } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import UserService from '../../../services/user.service';
import Loading from '../../components/loading';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';

const Users = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [list, setList] = useState<
		{
			name: string;
			email: string;
			phone: string;
		}[]
	>([]);

	useEffect(() => {
		setLoading(true);
		UserService.listUsers()
			.then(setList)
			.finally(() => setLoading(false));
	}, []);

	const openAbandonedCart = (email: string) => {
		navigate(`${NAVIGATION.ABANDONED_CARTS}?email=${email}`);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Users',
			icon: FaUserTag,
			link: NAVIGATION.USERS,
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

	const filtered = useFilteredList(list, { name: 1, email: 1, phone: 1 });

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Loading isLoaded={!loading} />

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
								<Th color={'gray'} width={'30%'}>
									Name
								</Th>
								<Th color={'gray'} width={'30%'}>
									Phone
								</Th>
								<Th color={'gray'} width={'30%'}>
									Email
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={filtered}
								render={(user, index) => (
									<Tr
										verticalAlign={'middle'}
										cursor={'pointer'}
										onClick={() => openAbandonedCart(user.email)}
									>
										<Td>{index + 1}.</Td>
										<Td>{user.name}</Td>
										<Td>{user.phone}</Td>
										<Td>{user.email}</Td>
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

export default Users;
