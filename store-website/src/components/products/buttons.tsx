'use client';
import { addToCart, removeFromCart } from '@/services/cart.service';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/services/wishlist.service';
import { Button, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';

export function BuyNowButton({ id }: { id: string }) {
	const router = useRouter();
	const handleClick = async () => {
		await addToCart(id);
		router.push('/cart');
	};
	return (
		<Button
			bgColor={'#FFE5CF'}
			py='0.5rem'
			px='3rem'
			rounded={'md'}
			_hover={{
				bgColor: '#F3D4BB',
			}}
			className='w-full md:w-max'
			onClick={handleClick}
		>
			<Text fontWeight={'medium'}>Buy Now</Text>
		</Button>
	);
}

export function AddToCart({ id }: { id: string }) {
	const toast = useToast();
	const handleClick = async () => {
		await addToCart(id);
		toast({ title: 'Added to Cart', position: 'top', status: 'success' });
	};

	return (
		<Button
			bgColor={'#F0F0F0'}
			py='0.5rem'
			px='2rem'
			rounded={'md'}
			_hover={{
				bgColor: '#E8E8E8',
			}}
			className='w-full md:w-max'
			leftIcon={<FiShoppingCart />}
			onClick={handleClick}
		>
			<Text fontWeight={'medium'}>Add To Cart</Text>
		</Button>
	);
}

export function WishlistButton({ id, defaultVal }: { id: string; defaultVal?: boolean }) {
	const [isWishlist, setWishlist] = useState(defaultVal ?? false);
	const router = useRouter();

	useEffect(() => {
		isInWishlist(id).then(setWishlist);
	}, [id]);

	const handleClick = async () => {
		if (isWishlist) {
			await removeFromWishlist(id);
			setWishlist(false);
		} else {
			const success = await addToWishlist(id);
			if (!success) {
				return router.push('/login?referrer=products');
			}
			setWishlist(true);
		}
	};

	return (
		<Button
			borderColor={'#891618'}
			variant={'outline'}
			py='0.5rem'
			px='1rem'
			rounded={'md'}
			onClick={handleClick}
		>
			{isWishlist ? <FaHeart color='#891618' /> : <FaRegHeart color='#891618' />}
		</Button>
	);
}

export function RemoveFromCart({ id }: { id: string }) {
	const router = useRouter();
	const handleClick = async () => {
		const success = await removeFromCart(id);
		if (success) {
			router.refresh();
		}
	};

	return (
		<Button
			borderColor={'#891618'}
			color={'#891618'}
			variant={'outline'}
			py='0.5rem'
			px='1rem'
			rounded={'md'}
			className='w-full md:w-max'
			leftIcon={<MdOutlineDelete color='#891618' />}
			onClick={handleClick}
		>
			<Text fontWeight={'medium'}>Delete </Text>
		</Button>
	);
}
