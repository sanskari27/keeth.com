import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Textarea,
	Th,
	Thead,
	Tr,
	VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import CollectionService from '../../../services/collection.service';
import FileService from '../../../services/file.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addProductCodeToCollection,
	editSelected,
	removeFile,
	removeProductCodeToCollection,
	setCollections,
	setError,
	setFile,
	setName,
	setSaving,
	setTagString,
} from '../../../store/reducers/CollectionsReducer';
import ProgressBar, { ProgressBarHandle } from '../../components/progress-bar';
import Each from '../../components/utils/Each';

export default function EditCollection() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id: collection_id } = useParams();
	const progressRef = useRef<ProgressBarHandle>(null);

	const {
		editSelected: { name, productCodes },
		fileDetails: { file, size, url },
		uiDetails: { error, isSaving },
		tagsString,
	} = useSelector((state: StoreState) => state[StoreNames.COLLECTIONS]);

	const { list } = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	const onClose = useCallback(() => {
		dispatch(editSelected('new'));
		navigate(NAVIGATION.COLLECTIONS);
	}, [dispatch, navigate]);

	useEffect(() => {
		dispatch(editSelected(collection_id ?? 'new'));
	}, [collection_id, dispatch]);

	const onUploadProgress = (progressEvent: number) => {
		progressRef.current?.setProgressValue(progressEvent);
	};

	const onSave = async () => {
		dispatch(setSaving(true));
		if (!collection_id) {
			dispatch(setSaving(false));
			return alert('Unable to edit collection. Please refresh and retry.');
		}

		if (file) {
			const filepath = await FileService.uploadFile('collections', file, onUploadProgress);
			if (!filepath) {
				dispatch(setSaving(false));
				return alert('Error uploading file...');
			}
		}

		const tags = tagsString
			.split(',')
			.map((t) => t.trim())
			.filter((t) => !!t)
			.map((t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());

		await CollectionService.updateCollectionTags(collection_id!, tags);
		await CollectionService.updateProductsInCollection(collection_id!, productCodes);
		CollectionService.getCollection().then((collections) => dispatch(setCollections(collections)));
		dispatch(setSaving(false));
		onClose();
	};

	const handleAttachmentInput = (file: File) => {
		if (file === null) return;
		const url = window.URL.createObjectURL(file);
		const fileSizeBytes = file.size;

		const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
		const fileSizeMB = fileSizeKB / 1024;

		let type = '';

		if (file.type.includes('image')) {
			type = 'image';
		}

		dispatch(
			setFile({
				file,
				type,
				size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
				url,
			})
		);
	};

	const removeSelectedFile = () => {
		dispatch(removeFile());
	};

	return (
		<Modal isCentered isOpen={true} onClose={onClose} size='4xl'>
			<ModalOverlay bg='blackAlpha.600' backdropFilter='blur(5px)' />

			<ModalContent>
				<ModalHeader />
				<ModalCloseButton />
				<ModalBody>
					<Box>
						<FormControl isInvalid={error === 'NAME'}>
							<FormLabel>Collection name</FormLabel>
							<Input
								placeholder='eg. Rings'
								value={name ?? ''}
								onChange={(e) => dispatch(setName(e.target.value))}
								borderColor={error === 'NAME' ? 'red.500' : 'black'}
								borderWidth={'1px'}
								padding={'0.5rem'}
								marginTop={'-0.25rem'}
								variant='unstyled'
								_placeholder={{
									color: error ? 'red.500' : 'black',
									opacity: 0.7,
								}}
								isDisabled={!!collection_id}
							/>
						</FormControl>
						<FormControl mt={'1rem'}>
							<FormLabel>Tags</FormLabel>
							<Textarea
								placeholder={`Enter tags separated by commas.`}
								value={tagsString ?? ''}
								onChange={(e) => dispatch(setTagString(e.target.value))}
								borderColor={'black'}
								borderWidth={'1px'}
								padding={'0.5rem'}
								marginTop={'-0.25rem'}
								variant='unstyled'
								_placeholder={{
									color: 'black',
									opacity: 0.7,
								}}
							/>
						</FormControl>
						<Box mt={'1rem'}>
							{!file ? (
								<>
									<DropzoneElement
										onFileInput={handleAttachmentInput}
										isInvalid={error === 'FILE'}
									/>
									<Text textAlign={'center'} fontSize={'xs'}>
										*File size should be less than 2MB
									</Text>
								</>
							) : (
								<VStack alignItems={'stretch'} gap='0.5rem'>
									<Text>Selected file : {file.name}</Text>
									<Flex alignItems={'center'} justifyContent={'space-between'}>
										<Text>Selected file size : {size}</Text>
										<Text
											textColor={'red.400'}
											fontWeight={'normal'}
											cursor={'pointer'}
											onClick={removeSelectedFile}
										>
											Remove
										</Text>
									</Flex>
									<Image src={url} aspectRatio={'16/9'} borderRadius='lg' />
								</VStack>
							)}
						</Box>

						<TableContainer pt={'0.5rem'} textColor={'black'}>
							<Table>
								<Thead>
									<Tr>
										<Th color={'gray'} width={'5%'}>
											Sl no
										</Th>
										<Th color={'gray'} width={'75%'}>
											Name
										</Th>

										<Th color={'gray'} width={'20%'} isNumeric>
											Price
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Each
										items={list}
										render={(product, index) => (
											<Tr verticalAlign={'middle'} cursor={'pointer'}>
												<Td>
													<Checkbox
														mr={'1rem'}
														isChecked={productCodes.includes(product.productCode)}
														onChange={(e) => {
															if (e.target.checked) {
																dispatch(addProductCodeToCollection(product.productCode));
															} else {
																dispatch(removeProductCodeToCollection(product.productCode));
															}
														}}
														colorScheme='green'
													/>
													{index + 1}.
												</Td>
												<Td>{product.name}</Td>
												<Td isNumeric>{product.price}</Td>
											</Tr>
										)}
									/>
								</Tbody>
							</Table>
						</TableContainer>
						<ProgressBar ref={progressRef} />
					</Box>
				</ModalBody>
				<ModalFooter justifyContent={'center'}>
					<Button
						isLoading={isSaving}
						isDisabled={productCodes.length === 0}
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

function DropzoneElement({
	onFileInput,
	isInvalid,
}: {
	isInvalid: boolean;
	onFileInput: (file: File) => void;
}) {
	const dispatch = useDispatch();
	return (
		<Dropzone
			onDropAccepted={(acceptedFile) => {
				onFileInput(acceptedFile[0]);
			}}
			maxSize={2097152}
			onDropRejected={() => dispatch(setError('File size should be less than 2MB'))}
			multiple={false}
			onError={(err) => {
				dispatch(setError(err.message));
			}}
		>
			{({ getRootProps, getInputProps }) => (
				<Box
					{...getRootProps()}
					borderWidth={'1px'}
					borderColor={isInvalid ? 'red.500' : 'black'}
					borderStyle={'dashed'}
					borderRadius={'lg'}
					py={'3rem'}
					textAlign={'center'}
					textColor={isInvalid ? 'red.300' : 'black'}
				>
					<input {...getInputProps()} />
					<Text>Drag and drop file here, or click to select files</Text>
				</Box>
			)}
		</Dropzone>
	);
}
