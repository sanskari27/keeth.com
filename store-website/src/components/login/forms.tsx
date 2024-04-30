'use client';
import { emailLogin } from '@/services/session.service';
import {
	Button,
	FormControl,
	FormErrorMessage,
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdOutlinePassword } from 'react-icons/md';

export function LoginForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const searchParams = useSearchParams();

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		const formData = new FormData(event.currentTarget);
		const success = await emailLogin(
			formData.get('email') as string,
			formData.get('password') as string
		);

		setLoading(false);

		if (success) {
			if (searchParams.get('referrer')) {
				router.push('/' + searchParams.get('referrer'));
			} else {
				router.push('/');
			}
		} else {
			setFailed(true);
		}
	};

	return (
		<form className='w-full flex flex-col gap-3 mt-4' onSubmit={handleLogin}>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<FaRegUserCircle color='gray.200' />
					</InputLeftElement>
					<Input
						type='email'
						name='email'
						variant='filled'
						placeholder='enter your email'
						pl={'2rem'}
					/>
				</InputGroup>
			</FormControl>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<MdOutlinePassword color='gray.200' />
					</InputLeftElement>
					<Input
						type='password'
						name='password'
						variant='filled'
						placeholder='enter your password'
						pl={'2rem'}
					/>
				</InputGroup>
			</FormControl>
			<Button
				py='0.5rem'
				w='full'
				bgColor={'#DB3E42'}
				_hover={{
					bgColor: '#BA3B3E',
				}}
				type='submit'
				color={'white'}
				isLoading={loading}
			>
				Login
			</Button>
		</form>
	);
}

export function RegisterForm() {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const searchParams = useSearchParams();

	const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		const formData = new FormData(event.currentTarget);
		const success = await emailLogin(
			formData.get('email') as string,
			formData.get('password') as string
		);
		setLoading(false);

		if (success) {
			if (searchParams.get('referrer')) {
				router.push('/' + searchParams.get('referrer'));
			} else {
				router.push('/');
			}
		} else {
			setFailed(true);
		}
	};

	return (
		<form className='w-full flex flex-col gap-3 mt-4'>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<FaRegUserCircle color='gray.200' />
					</InputLeftElement>
					<Input type='email' variant='filled' placeholder='enter your email' pl={'2rem'} />
					{failed ? <FormErrorMessage>Email is already in use.</FormErrorMessage> : null}
				</InputGroup>
			</FormControl>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<MdOutlinePassword color='gray.200' />
					</InputLeftElement>
					<Input type='password' variant='filled' placeholder='enter your password' pl={'2rem'} />
				</InputGroup>
			</FormControl>
			<InputGroup>
				<InputLeftElement pointerEvents='none'>
					<MdOutlinePassword color='gray.200' />
				</InputLeftElement>
				<Input type='password' variant='filled' placeholder='confirm password' pl={'2rem'} />
			</InputGroup>
			<Button
				py='0.5rem'
				w='full'
				bgColor={'#DB3E42'}
				_hover={{
					bgColor: '#BA3B3E',
				}}
				type='submit'
				color={'white'}
				isLoading={loading}
			>
				Register
			</Button>
		</form>
	);
}
