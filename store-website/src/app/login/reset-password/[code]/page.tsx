import { ResetPasswordForm } from '@/components/login/forms';
import { Box, Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { Suspense } from 'react';

type Props = {
	params: { code: string };
};

export const metadata = {
	title: 'Confirm new password • Keeth',
};

export default async function GoogleLogin({ params: { code } }: Props) {
	return (
		<Box width='full'>
			<Flex className='min-h-screen  justify-center items-center'>
				<Box
					bgColor={'white'}
					rounded={'2xl'}
					className='drop-shadow-lg shadow-lg w-[400px] md:w-[500px]'
				>
					<VStack alignItems={'center'} p='2rem'>
						<Text fontWeight={'bold'}>Confirm new password</Text>
						<Suspense>
							<ResetPasswordForm token={code} />
						</Suspense>

						<Divider className='my-4 border !border-black/40' />
						<Link
							className='w-full'
							href={{
								pathname: '/login',
								query: {
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
								I don't want to reset my password
							</Button>
						</Link>
					</VStack>
				</Box>
			</Flex>
		</Box>
	);
}
