'use client';
import {
	emailLogin,
	registerEmail,
	resetPassword,
	updatePassword,
} from '@/services/session.service';
import {
	Button,
	FormControl,
	FormErrorMessage,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Stack,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdOutlinePassword } from 'react-icons/md';

export function LoginForm() {
	const router = useRouter();
	const toast = useToast();
	const [loading, setLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const [usernameRequired, setUsernameRequired] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);
	const searchParams = useSearchParams();

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		const success = await emailLogin(username, password);

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

	const handleResetPassword = async () => {
		if (!username) {
			setUsernameRequired(true);
			setTimeout(() => {
				setUsernameRequired(false);
			}, 3000);
			return;
		}

		setLoading(true);

		const success = await resetPassword(username);

		setLoading(false);

		if (success) {
			toast({
				status: 'success',
				title: 'Password reset link sent.',
				position: 'top',
			});
		} else {
			toast({
				status: 'error',
				title: 'No linked account found.',
				position: 'top',
			});
		}
	};

	return (
		<form className='w-full flex flex-col gap-3 mt-4' onSubmit={handleLogin}>
			<FormControl isInvalid={failed || usernameRequired}>
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
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</InputGroup>
			</FormControl>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<MdOutlinePassword color='gray.200' />
					</InputLeftElement>
					<Input
						type={show ? 'text' : 'password'}
						name='password'
						variant='filled'
						placeholder='enter your password'
						pl={'2rem'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Stack width={'full'} alignItems={'center'}>
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
				<Text p={0} marginTop={'-0.5rem'} cursor={'pointer'} onClick={handleResetPassword}>
					reset password
				</Text>
			</Stack>
		</form>
	);
}

export function RegisterForm() {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const searchParams = useSearchParams();
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		if ((formData.get('password') as string) !== (formData.get('confirm=password') as string)) {
			return setFailed(true);
		}
		setFailed(false);
		setLoading(true);
		const success = await registerEmail(
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
		<form className='w-full flex flex-col gap-3 mt-4' onSubmit={handleRegister}>
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
					{failed ? <FormErrorMessage>Email is already in use.</FormErrorMessage> : null}
				</InputGroup>
			</FormControl>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<MdOutlinePassword color='gray.200' />
					</InputLeftElement>
					<Input
						type={show ? 'text' : 'password'}
						name='password'
						variant='filled'
						placeholder='enter your password'
						pl={'2rem'}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<InputGroup>
				<InputLeftElement pointerEvents='none'>
					<MdOutlinePassword color='gray.200' />
				</InputLeftElement>
				<Input
					type='password'
					name='confirm=password'
					variant='filled'
					placeholder='confirm password'
					pl={'2rem'}
				/>
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

export function ResetPasswordForm({ token }: { token: string }) {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		if ((formData.get('password') as string) !== (formData.get('confirm=password') as string)) {
			return setFailed(true);
		}
		setFailed(false);
		setLoading(true);
		const success = await updatePassword(token, formData.get('password') as string);
		setLoading(false);

		if (success) {
			router.push('/login');
		} else {
			setFailed(true);
		}
	};

	return (
		<form className='w-full flex flex-col gap-3 mt-4' onSubmit={handleRegister}>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<MdOutlinePassword color='gray.200' />
					</InputLeftElement>
					<Input
						type={show ? 'text' : 'password'}
						name='password'
						variant='filled'
						placeholder='enter your password'
						pl={'2rem'}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl isInvalid={failed}>
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<MdOutlinePassword color='gray.200' />
					</InputLeftElement>
					<Input
						type='password'
						name='confirm=password'
						variant='filled'
						placeholder='confirm password'
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
				Update Password
			</Button>
		</form>
	);
}
