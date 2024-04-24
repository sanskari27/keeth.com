import { ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, FormControl, FormLabel, Image, Input, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LOGO } from '../../../assets/Images';
import { NAVIGATION } from '../../../config/const';
import { startAuth, useAuth } from '../../../hooks/useAuth';
import { PasswordField } from './components/PasswordField';

export default function Login() {
	const { isAuthenticated, isAuthenticating, isValidating } = useAuth();

	const [{ username, password }, setCredentials] = useState({
		username: '',
		password: '',
	});

	const [{ usernameError, passwordError, loginError }, setUIDetails] = useState({
		usernameError: false,
		passwordError: false,
		loginError: false,
	});

	if (isAuthenticated) {
		return <Navigate to={NAVIGATION.HOME} />;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCredentials((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
		setUIDetails((prev) => ({
			...prev,
			[e.target.name + 'Error']: false,
		}));
	};

	const handleLogin = async () => {
		if (!username || !password) {
			return setUIDetails({
				usernameError: !username,
				passwordError: !password,
				loginError: false,
			});
		}
		const valid = await startAuth(username, password);
		if (!valid) {
			setUIDetails({
				passwordError: true,
				usernameError: true,
				loginError: true,
			});
			setTimeout(() => {
				setUIDetails({
					passwordError: false,
					usernameError: false,
					loginError: false,
				});
			}, 2000);
		}
	};

	return (
		<>
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				flexDirection='column'
				width={'100vw'}
				height={'100vh'}
			>
				<Flex
					direction={'column'}
					justifyContent={'center'}
					alignItems={'center'}
					flexDirection='column'
					padding={'3rem'}
					rounded={'lg'}
					width={'500px'}
					height={'550px'}
					className='border shadow-xl drop-shadow-xl '
				>
					<Flex
						direction={'column'}
						justifyContent={'center'}
						alignItems={'center'}
						flexDirection='column'
						rounded={'lg'}
						width={'300px'}
						height={'550px'}
					>
						{!isValidating ? (
							<>
								<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
									<Image src={LOGO} width={'120px'} className='shadow-lg rounded-full' />
								</Flex>
								<Stack spacing='5' width={'full'}>
									<FormControl isInvalid={usernameError}>
										<FormLabel htmlFor='email' color={'gray'}>
											Username
										</FormLabel>
										<Input
											id='email'
											type='email'
											name='username'
											value={username}
											color={'black'}
											onChange={handleChange}
										/>
									</FormControl>
									<PasswordField
										isInvalid={passwordError}
										name='password'
										value={password}
										onChange={handleChange}
									/>
									<Button
										width={'full'}
										onClick={handleLogin}
										isLoading={isAuthenticating}
										colorScheme={loginError ? 'red' : 'green'}
									>
										<Text textColor='white' fontSize={'lg'} fontWeight='bold'>
											Continue
										</Text>
										<ChevronRightIcon w={6} h={6} color='white' ml={'0.5rem'} />
									</Button>
								</Stack>
							</>
						) : (
							<Loading />
						)}
					</Flex>
				</Flex>
			</Flex>
		</>
	);
}

function Loading() {
	return (
		<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
			<Image src={LOGO} width={'120px'} className='shadow-lg rounded-full animate-ping' />
		</Flex>
	);
}
