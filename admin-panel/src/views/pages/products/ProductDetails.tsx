import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Image,
	Input,
	Select,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoSave } from 'react-icons/io5';
import { MdCancelPresentation, MdUpdate } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { NAVIGATION, SERVER_URL } from '../../../config/const';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import FileService from '../../../services/file.service';
import ProductService from '../../../services/product.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setCreating,
	setFetching,
	setPricingBifurcation,
	setProductDetails,
	setSaving,
	setUpdating,
} from '../../../store/reducers/ProductsReducer';
import { ProductDetails as TProductDetails } from '../../../store/types/ProductsState';
import Loading from '../../components/loading';

type FormState = Omit<TProductDetails, 'discontinued' | 'listedOn' | 'images' | 'videos'> & {
	images: string[] | undefined;
	videos: string[] | undefined;
};

export default function ProductDetails() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { productCode, id } = useParams();
	const [urlSearchParams] = useSearchParams();

	const onSave = async (details: FormState) => {
		dispatch(setSaving(true));
		const success = await ProductService.createProduct(details);
		if (!success) {
			dispatch(setSaving(false));
			return alert('Error Adding Product');
		}
		navigate(`${NAVIGATION.PRODUCT}/${productCode}`);
		dispatch(setSaving(false));
	};

	const onUpdate = async (details: FormState) => {
		dispatch(setSaving(true));
		const success = await ProductService.updateProduct(details.id, details);
		if (!success) {
			dispatch(setSaving(false));
			return alert('Error Updating Product');
		}
		navigate(`${NAVIGATION.PRODUCT}/${productCode}`);
		dispatch(setSaving(false));
	};

	const {
		uiDetails: { isFetching },
	} = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	useEffect(() => {
		return () => {
			dispatch(reset());
		};
	}, [dispatch]);

	useEffect(() => {
		const clone_id = urlSearchParams.get('clone_product_id');
		dispatch(reset());

		if (id) {
			dispatch(setUpdating(true));
			dispatch(setFetching(true));
			ProductService.fetchDetails(id).then((product) => {
				if (!product) {
					return navigate(NAVIGATION.PRODUCT);
				}
				dispatch(setProductDetails(product));
				dispatch(setFetching(false));
			});
		} else {
			dispatch(setCreating(true));
			if (clone_id) {
				dispatch(setFetching(true));
				ProductService.fetchDetails(clone_id).then((product) => {
					if (!product) {
						return navigate(NAVIGATION.PRODUCT);
					}
					dispatch(setProductDetails(product));
					dispatch(setFetching(false));
				});
			}
		}
	}, [dispatch, id, navigate, urlSearchParams]);

	useEffect(() => {
		pushToNavbar({
			title: 'Product Details',
		});
		return () => {
			popFromNavbar();
		};
	}, []);

	if (isFetching) {
		return <Loading isLoaded={false} />;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Heading color={'black'}>
				<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
					Product Details
				</Flex>
			</Heading>

			<Box marginTop={'2rem'}>
				<DetailsForm onSave={onSave} onUpdate={onUpdate} />
			</Box>
		</Flex>
	);
}

function DetailsForm({
	onSave,
	onUpdate,
}: {
	onSave: (details: FormState) => void;
	onUpdate: (details: FormState) => void;
}) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		productDetails: product,
		uiDetails: { isCreating, isSaving },
		pricing_bifurcation,
	} = useSelector((state: StoreState) => state[StoreNames.PRODUCTS]);

	const { register, handleSubmit } = useForm({
		defaultValues: {
			...product,
			_images: [],
			_videos: [],
			_tags: product.tags.join(', '),
		},
	});

	const onSubmit = async (
		data: Omit<TProductDetails, 'discontinued' | 'listedOn'> & {
			_images: File[];
			_videos: File[];
			_tags: string;
		}
	) => {
		const images = (await Promise.all(
			Array.from(data._images).map(async (item) => await FileService.uploadFile('products', item))
		)) as string[];

		const videos = (await Promise.all(
			Array.from(data._videos).map(async (item) => await FileService.uploadFile('products', item))
		)) as string[];

		const productDetails = {
			id: data.id,
			productCode: data.productCode,
			name: data.name,
			description: data.description,
			details: data.details,
			pricing_bifurcation: pricing_bifurcation ?? data.pricing_bifurcation,
			images: images.length > 0 ? images : product.images,
			videos: videos.length > 0 ? videos : product.videos,
			tags: data._tags.split(',').map((t) => t.trim()),
			size: data.size,
			metal_color: data.metal_color,
			metal_type: data.metal_type,
			metal_quality: data.metal_quality,
			diamond_type: data.diamond_type,
			price: data.price,
			discount: data.discount,
		} satisfies FormState;

		if (isCreating) {
			onSave(productDetails);
		} else {
			onUpdate(productDetails);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.5rem',
			}}
		>
			<HStack justifyContent={'space-between'}>
				<FormControl width={'33%'}>
					<FormLabel>Product Code</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						isDisabled={!isCreating}
						placeholder='Product Code'
						{...register('productCode', { required: true, maxLength: 15 })}
					/>
				</FormControl>
				<FormControl width={'64%'}>
					<FormLabel>Product Name</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						placeholder='Product Name'
						{...register('name', { required: true, maxLength: 15 })}
					/>
				</FormControl>
			</HStack>

			<FormControl>
				<FormLabel>Tagline</FormLabel>
				<Input
					marginTop={'-0.25rem'}
					type='text'
					placeholder='From The Precious Promise Collection'
					{...register('description')}
				/>
			</FormControl>

			<FormControl>
				<FormLabel>Details</FormLabel>
				<Input
					marginTop={'-0.25rem'}
					type='text'
					placeholder='Diamond Ring In 18Kt Yellow Gold (3.33 gram with Diamonds (0.2650 Ct)'
					{...register('details')}
				/>
			</FormControl>

			<HStack justifyContent={'space-between'}>
				<FormControl>
					<FormLabel>Metal Type</FormLabel>
					<Select marginTop={'-0.25rem'} {...register('metal_type', { required: true })}>
						<option value='Gold'>Gold</option>
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel>Metal Color</FormLabel>
					<Select marginTop={'-0.25rem'} {...register('metal_color', { required: true })}>
						<option value='Rose Gold'>Rose Gold</option>
						<option value='Yellow'>Yellow</option>
						<option value='White'>White</option>
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel>Metal Purity</FormLabel>
					<Select marginTop={'-0.25rem'} {...register('metal_quality', { required: true })}>
						<option value='14K'>14K</option>
						<option value='18K'>18K</option>
						<option value='22K'>22K</option>
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel>Diamond Type</FormLabel>
					<Select marginTop={'-0.25rem'} {...register('diamond_type', { required: true })}>
						<option value='NONE'>None</option>
						<option value='SI IJ'>SI IJ</option>
						<option value='SI GH'>SI GH</option>
						<option value='VS GH'>VS GH</option>
						<option value='VVS EF'>VVS EF</option>
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel>Size</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						placeholder='(optional)'
						{...register('size')}
					/>
				</FormControl>
			</HStack>

			<HStack justifyContent={'space-between'}>
				<FormControl>
					<FormLabel>Price</FormLabel>
					<Input marginTop={'-0.25rem'} type='number' placeholder='Price' {...register('price')} />
				</FormControl>

				<FormControl>
					<FormLabel>Discount</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='number'
						placeholder='Discount'
						{...register('discount')}
					/>
				</FormControl>
			</HStack>

			<SunEditor
				height='300px'
				setOptions={{
					buttonList: buttonList.complex,
				}}
				defaultValue={product.pricing_bifurcation}
				onChange={(e) => dispatch(setPricingBifurcation(e))}
			/>

			<HStack>
				<FormControl>
					<FormLabel>Images</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='file'
						accept='image/*'
						{...register('_images')}
						multiple
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Videos</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='file'
						accept='video/mp4,video/x-m4v,video/*'
						{...register('_videos')}
						multiple
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Tags</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						placeholder='comma separated tags'
						{...register('tags')}
					/>
				</FormControl>
			</HStack>
			<HStack marginTop={'2rem'}>
				{product.images.length > 0 && (
					<Box flexGrow={1}>
						<Carousel>
							{product.images.map((item, index) => (
								<Box key={index}>
									<Image
										src={`${SERVER_URL}media/${item}`}
										height={'350px'}
										objectFit={'contain'}
										borderRadius={'0.75rem'}
										loading='lazy'
									/>
								</Box>
							))}
						</Carousel>
					</Box>
				)}
				{product.videos.length > 0 && (
					<Box flexGrow={1}>
						<Carousel>
							{product.videos.map((item, index) => (
								<Flex key={index} justifyContent={'center'}>
									<video style={{ borderRadius: '0.75rem', height: '350px' }} controls>
										<source src={`${SERVER_URL}media/${item}`} type='video/mp4' />
									</video>
								</Flex>
							))}
						</Carousel>
					</Box>
				)}
			</HStack>

			<ButtonGroup alignSelf={'end'}>
				<Button
					variant='outline'
					colorScheme='red'
					leftIcon={<MdCancelPresentation />}
					onClick={() => navigate(NAVIGATION.PRODUCT)}
				>
					Discard
				</Button>
				{isCreating ? (
					<Button
						variant='outline'
						colorScheme='green'
						leftIcon={<IoSave />}
						isLoading={isSaving}
						type='submit'
					>
						Add Product
					</Button>
				) : (
					<Button
						variant='outline'
						colorScheme='green'
						leftIcon={<MdUpdate />}
						isLoading={isSaving}
						type='submit'
					>
						Update
					</Button>
				)}
			</ButtonGroup>
		</form>
	);
}
