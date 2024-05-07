import { LoginForm, RegisterForm } from '@/components/login/forms';
import verifyAuth from '@/helpers/verifyAuth';
import { GOOGLE_CLIENT_ID, WEBSITE_URL } from '@/lib/const';
import { Box, Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { Suspense } from 'react';
import { FcGoogle } from 'react-icons/fc';

export const metadata = {
	title: 'Login • Keeth',
};

export default async function Login({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	await verifyAuth({
		redirectUrl: searchParams['referrer'] ? `/${searchParams['referrer']}` : '/',
	});

	return (
		<Box width='full'>
			<Flex className='min-h-screen  justify-center items-center'>
				<Box
					bgColor={'white'}
					rounded={'2xl'}
					className='drop-shadow-lg shadow-lg w-[400px] md:w-[500px]'
				>
					<VStack
						hidden={searchParams['stage'] === 'register'}
						width={'full'}
						alignItems={'center'}
						p='2rem'
					>
						<Text fontWeight={'bold'}>Welcome Back!</Text>
						<Suspense>
							<LoginForm />
						</Suspense>

						<Divider className='my-4 border !border-black/40' />
						<Link
							className='w-full'
							href={{
								pathname: 'login',
								query: {
									referrer: searchParams['referrer'],
									stage: 'register',
								},
							}}
						>
							<Button
								py='0.5rem'
								w='full'
								variant={'outline'}
								borderColor={'#DB3E42'}
								color={'black'}
							>
								New ? Register
							</Button>
						</Link>
						<Link
							className='w-full'
							href={`https://accounts.google.com/o/oauth2/v2/auth?scope=email&response_type=code&redirect_uri=${WEBSITE_URL}&client_id=${GOOGLE_CLIENT_ID}`}
						>
							<Button py='0.5rem' w='full' leftIcon={<FcGoogle />}>
								Continue with Google
							</Button>
						</Link>
					</VStack>
					<VStack
						hidden={searchParams['stage'] !== 'register'}
						width={'full'}
						alignItems={'center'}
						p='2rem'
					>
						<Text fontWeight={'bold'}>Register Now</Text>
						<Suspense>
							<RegisterForm />
						</Suspense>

						<Divider className='my-4 border !border-black/40' />
						<Link
							className='w-full'
							href={{
								pathname: 'login',
								query: {
									referrer: searchParams['referrer'],
									stage: 'login',
								},
							}}
						>
							<Button
								py='0.5rem'
								w='full'
								variant={'outline'}
								borderColor={'#DB3E42'}
								color={'black'}
							>
								Already have a account ? Login
							</Button>
						</Link>
						<Link
							className='w-full'
							href={`https://accounts.google.com/o/oauth2/v2/auth?scope=email&response_type=code&redirect_uri=${WEBSITE_URL}&client_id=${GOOGLE_CLIENT_ID}`}
						>
							<Button py='0.5rem' w='full' leftIcon={<FcGoogle />}>
								Continue with Google
							</Button>
						</Link>
					</VStack>
				</Box>
			</Flex>
		</Box>
	);
}
