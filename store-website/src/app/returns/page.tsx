import { AbsoluteCenter, Box, Divider, Text, VStack } from '@chakra-ui/react';

export default async function Returns() {
	return (
		<section>
			<VStack width='86%' mx='auto' pt={'160px'} pb={'1rem'} gap={'1rem'}>
				<Box width={'full'} position='relative'>
					<Divider className='border-2 !border-[#DB3E42] ' />
					<AbsoluteCenter bg='white' px='4'>
						<Text className='aura-bella text-2xl md:text-4xl'>Return & Refund Policy</Text>
					</AbsoluteCenter>
				</Box>
				<Box mx='5%' marginTop={'2rem'} textAlign={'justify'} fontSize={'1.1rem'}>
					<Text>
						● This Privacy Policy describes how your personal information is collected, used, and
						shared when you visit or make a purchase from our website.
					</Text>
					<Text mt={'1rem'}>
						● To be eligible for a return, your item must be in the same condition that you received
						it, unworn or unused, and in its original packaging. You’ll also need the receipt or
						proof of purchase.
					</Text>
					<Text mt={'1rem'}>
						● Lifetime exchange at 5% deduction, refund at 10% deduction of the original billing
						amount.
					</Text>
					<Text mt={'1rem'}>
						● To start a return, you can contact us at keethjewels@gmail.com or call at 9205893607
					</Text>
				</Box>
			</VStack>
		</section>
	);
}
