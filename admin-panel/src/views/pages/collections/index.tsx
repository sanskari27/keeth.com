import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Divider,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	IconButton,
	Image,
	Progress,
	Switch,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { MdCollectionsBookmark, MdOutlineCreate } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useOutlet } from 'react-router-dom';
import APIInstance from '../../../config/APIInstance';
import { NAVIGATION, SERVER_URL } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import CollectionService from '../../../services/collection.service';
import { StoreNames, StoreState } from '../../../store';
import { updateVisibility } from '../../../store/reducers/CollectionsReducer';
import { Collection } from '../../../store/types/CollectionsState';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import { NavbarSearchElement } from '../../components/navbar';
import Each from '../../components/utils/Each';

const Collections = () => {
	const outlet = useOutlet();
	const deleteAlertRef = useRef<DeleteAlertHandle>(null);

	const { list, selected } = useSelector((state: StoreState) => state[StoreNames.COLLECTIONS]);

	const deleteCollections = (id: string) => {
		console.log(id);

		// selectedTasks.forEach(async (id) => {
		// 	removeTask(id);
		// });
		// setSelectedTasks([]);
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Collections',
			icon: MdCollectionsBookmark,
			link: NAVIGATION.COLLECTIONS,
			actions: (
				<HStack>
					<NavbarSearchElement />
				</HStack>
			),
		});
		return () => {
			popFromNavbar();
		};
	}, [selected.length]);

	const filtered = useFilteredList(list, { name: 1 });

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Collections
					<Link to={NAVIGATION.COLLECTIONS + '/new'}>
						<Button
							variant='outline'
							size={'sm'}
							colorScheme='green'
							leftIcon={<MdOutlineCreate />}
						>
							Create Collection
						</Button>
					</Link>
				</Flex>
			</Heading>

			<Box marginTop={'1rem'} width={'98%'} pb={'5rem'}>
				<Text textAlign={'right'} color={'black'}>
					{filtered.length} records found.
				</Text>

				<Grid alignItems={'flex-start'} templateColumns='repeat(3, 1fr)' gap={6}>
					<Each
						items={filtered}
						render={(collection) => (
							<GridItem>
								<PreviewElement
									collection={collection}
									onRemove={() => deleteAlertRef.current?.open(collection.id)}
								/>
							</GridItem>
						)}
					/>
				</Grid>
			</Box>
			<DeleteAlert type={'Collection'} ref={deleteAlertRef} onConfirm={deleteCollections} />
			{outlet}
		</Flex>
	);
};

function PreviewElement({
	collection,
	onRemove,
}: {
	collection: Collection;
	onRemove: () => void;
}) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [progress, setProgress] = useState(0);
	const [data, setData] = useState<string | null>(null);

	useEffect(() => {
		APIInstance.get(`${SERVER_URL}images/${collection.image}`, {
			responseType: 'blob',
			onDownloadProgress: (progressEvent) => {
				if (progressEvent.total) {
					setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
				} else {
					setProgress(-1);
				}
			},
		}).then((response) => {
			const { data: blob } = response;
			const url = window.URL.createObjectURL(blob);

			setData(url);
		});
	}, [collection]);

	function handleVisibleChange(id: string, checked: boolean) {
		CollectionService.updateVisibility(id, checked);
		dispatch(updateVisibility({ id, visible: checked }));
	}

	return (
		<Card size='sm' rounded={'2xl'}>
			<CardBody>
				{!data ? (
					<>
						<Text textAlign={'center'} className='animate-pulse'>
							loading...
						</Text>
						<Progress
							mt={'0.25rem'}
							isIndeterminate={progress === -1}
							value={progress}
							size='xs'
							colorScheme='green'
							rounded={'lg'}
						/>
					</>
				) : (
					<Image src={data} aspectRatio={'16/9'} borderRadius='lg' />
				)}
			</CardBody>
			<Divider />
			<CardFooter>
				<VStack alignItems={'stretch'} width={'full'}>
					<Flex justifyContent={'space-between'} mt='3'>
						<Heading size='md'>{collection.name}</Heading>
						<HStack alignItems={'center'}>
							<Text>Home Collection</Text>
							<Switch
								size='md'
								isChecked={collection.visibleAtHome}
								onChange={(e) => {
									handleVisibleChange(collection.id, e.target.checked);
								}}
							/>
						</HStack>
					</Flex>
					<Flex gap={'0.5rem'} alignItems={'center'}>
						<Text>
							Tags : <span style={{ fontWeight: '500' }}>{collection.tags.join(', ')}</span>
						</Text>
					</Flex>
					<Flex gap='2'>
						<Button
							flexGrow={1}
							leftIcon={<EditIcon />}
							variant='solid'
							colorScheme='green'
							onClick={() => navigate(NAVIGATION.COLLECTIONS + '/edit/' + collection.id)}
						>
							Edit
						</Button>
						<IconButton
							aria-label='delete'
							icon={<DeleteIcon color={'red.400'} />}
							variant='unstyled'
							colorScheme='red'
							border={'1px red solid'}
							_hover={{
								bgColor: 'red.100',
							}}
							onClick={onRemove}
						/>
					</Flex>
				</VStack>
			</CardFooter>
		</Card>
	);
}

export default Collections;
