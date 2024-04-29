'use client';
import { Button, Flex, Text } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';

export default function CustomizationNotAvailable() {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<Flex marginY={'5rem'} direction={'column'} alignItems={'center'} px={'5%'}>
			<Text fontWeight={'bold'} fontSize={'2xl'}>
				Sorry, this customization is not available right now.
			</Text>
			<Button onClick={() => router.push(pathname)}>Reset Customization</Button>
		</Flex>
	);
}
