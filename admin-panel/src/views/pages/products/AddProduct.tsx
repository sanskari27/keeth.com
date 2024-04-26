import {
	Box,
	Button,
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
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import CollectionService from '../../../services/collection.service';
import FileService from '../../../services/file.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addCollection,
	editSelected,
	removeFile,
	setError,
	setFile,
	setName,
	setSaving,
	setTagString,
} from '../../../store/reducers/CollectionsReducer';
import ProgressBar, { ProgressBarHandle } from '../../components/progress-bar';

export default function CreateCollection() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const progressRef = useRef<ProgressBarHandle>(null);

	const {
		editSelected: { name },
		fileDetails: { file, size, url },
		uiDetails: { error },
		tagsString,
	} = useSelector((state: StoreState) => state[StoreNames.COLLECTIONS]);

	const onClose = useCallback(() => {
		dispatch(editSelected('new'));
		navigate(NAVIGATION.COLLECTIONS);
	}, [dispatch, navigate]);

	useEffect(() => {
		dispatch(editSelected('new'));
	}, [dispatch]);

	const onUploadProgress = (progressEvent: number) => {
		progressRef.current?.setProgressValue(progressEvent);
	};

	const onSave = async () => {
		if (!file) {
			return dispatch(setError('FILE'));
		}
		dispatch(setSaving(true));
		const filepath = await FileService.uploadFile('collections', file, onUploadProgress);
		if (!filepath) {
			return dispatch(setError('Error uploading file...'));
		}
		const col = await CollectionService.createCollection(
			CollectionService.getCollectionId(name),
			name,
			filepath
		);
		if (!col) {
			return dispatch(setError('Error creating collection...'));
		}
		dispatch(addCollection(col));
		onClose();
		dispatch(setSaving(false));
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
		<Modal isCentered isOpen={true} onClose={onClose} size='2xl'>
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
						<ProgressBar ref={progressRef} />
					</Box>
				</ModalBody>
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
