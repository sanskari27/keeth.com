import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	Select,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoSave } from 'react-icons/io5';
import { MdCancelPresentation, MdUpdate } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import CouponService from '../../../services/coupon.service';
import { StoreNames, StoreState } from '../../../store';
import {
	editSelected,
	reset,
	setCoupons,
	setCreating,
	setSaving,
	setUpdating,
} from '../../../store/reducers/CouponReducer';
import { Coupon } from '../../../store/types/CouponState';

export default function CouponDetails() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	const onSave = async (details: Coupon) => {
		dispatch(setSaving(true));
		const success = await CouponService.createCoupon(details);
		if (!success) {
			dispatch(setSaving(false));
			return alert('Error Adding Product');
		}
		CouponService.listCoupons().then((coupons) => dispatch(setCoupons(coupons)));
		navigate(NAVIGATION.COUPONS);
		dispatch(setSaving(false));
	};

	const onUpdate = async (details: Coupon) => {
		dispatch(setSaving(true));
		const success = await CouponService.updateCoupon(details.id, details);
		if (!success) {
			dispatch(setSaving(false));
			return alert('Error Updating Product');
		}
		CouponService.listCoupons().then((coupons) => dispatch(setCoupons(coupons)));
		navigate(NAVIGATION.COUPONS);
		dispatch(setSaving(false));
	};

	useEffect(() => {
		return () => {
			dispatch(reset());
		};
	}, [dispatch]);

	useEffect(() => {
		dispatch(reset());

		if (id) {
			dispatch(setUpdating(true));
			dispatch(editSelected(id));
		} else {
			dispatch(setCreating(true));
		}
	}, [dispatch, id, navigate]);

	useEffect(() => {
		pushToNavbar({
			title: 'Coupon Details',
		});
		return () => {
			popFromNavbar();
		};
	}, []);

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
	onSave: (details: Coupon) => void;
	onUpdate: (details: Coupon) => void;
}) {
	const navigate = useNavigate();

	const {
		couponDetails,
		uiDetails: { isCreating, isSaving },
	} = useSelector((state: StoreState) => state[StoreNames.COUPONS]);

	const { register, handleSubmit, reset } = useForm({
		defaultValues: couponDetails,
	});
	useEffect(() => {
		reset(couponDetails);
	}, [couponDetails, reset]);

	const onSubmit = async (data: Coupon) => {
		const productDetails = {
			id: data.id,
			name: data.name,
			couponCode: data.couponCode,
			availableCoupon: Number(data.availableCoupon),
			discountAmount: Number(data.discountAmount),
			discountPercentage: Number(data.discountPercentage),
			discountType: data.discountType,
		} satisfies Coupon;

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
				<FormControl width={'45%'}>
					<FormLabel>Coupon Name</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						isDisabled={!isCreating}
						placeholder='Coupon Name'
						{...register('name', { required: true, maxLength: 20 })}
					/>
				</FormControl>
				<FormControl width={'45%'}>
					<FormLabel>Coupon Code</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						isDisabled={!isCreating}
						placeholder='Coupon Code'
						{...register('couponCode', { required: true, maxLength: 10 })}
					/>
				</FormControl>
			</HStack>

			<HStack justifyContent={'space-between'}>
				<FormControl>
					<FormLabel>Available Coupons</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						isDisabled={!isCreating}
						placeholder='1000'
						{...register('availableCoupon')}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Discount Type</FormLabel>
					<Select marginTop={'-0.25rem'} {...register('discountType')}>
						<option value='amount'>Amount</option>
						<option value='percentage'>Percentage</option>
					</Select>
				</FormControl>
			</HStack>

			<HStack justifyContent={'space-between'}>
				<FormControl>
					<FormLabel>Discount Amount</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						placeholder='1000'
						{...register('discountAmount')}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Discount Percentage</FormLabel>
					<Input
						marginTop={'-0.25rem'}
						type='text'
						placeholder='0 - 100'
						{...register('discountPercentage')}
					/>
				</FormControl>
			</HStack>

			<ButtonGroup alignSelf={'end'}>
				<Button
					variant='outline'
					colorScheme='red'
					leftIcon={<MdCancelPresentation />}
					onClick={() => navigate(NAVIGATION.COUPONS)}
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
						Add Coupon
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
