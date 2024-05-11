import { AbsoluteCenter, Box, Divider, Text, VStack } from '@chakra-ui/react';

export const metadata = {
	title: 'Shipping Policy • Keeth',
};

export default async function Terms() {
	return (
		<section>
			<VStack width='86%' mx='auto' pt={'160px'} pb={'1rem'} gap={'1rem'}>
				<Box width={'full'} position='relative'>
					<Divider className='border-2 !border-[#DB3E42] ' />
					<AbsoluteCenter bg='white' px='4'>
						<Text className='aura-bella text-2xl md:text-4xl'>Shipping Policy</Text>
					</AbsoluteCenter>
				</Box>
				<Box mx='5%' marginTop={'2rem'} textAlign={'justify'} fontSize={'1.1rem'}>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>SHIPPING DESTINATIONS AND CHARGES</Text>
						<Text>We provide free shipping all over India</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text mt={'0.5rem'}>
							Ready products will be delivered within 5-7 working days. Make to order/customize
							jewellery will be shipped within 15-18 working days.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text mt={'0.5rem'}>
							A tentative delivery date will be given along with the order confirmation email. The
							exact delivery date shall be provided as soon as your order is ready for dispatch.
						</Text>
					</Box>
				</Box>
			</VStack>
		</section>
	);
}
