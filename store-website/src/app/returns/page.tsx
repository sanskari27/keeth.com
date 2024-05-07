import { AbsoluteCenter, Box, Divider, Text, VStack } from '@chakra-ui/react';

export const metadata = {
	title: 'Return Policy • Keeth',
};

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
						We offer a 24-hour return policy. If you decide to return a product, please inform us
						immediately upon its receipt with a valid reason. From the time of receiving the product
						(tracked via courier delivery), you have 24 hours to provide satisfactory proof (Video
						proof) of return dispatch to claim your refund. No returns will be accepted after 24
						hours of receiving the product.
					</Text>
					<Text mt={'1rem'}>
						Your refund amount depends on the condition of the product upon return. If the product
						is damaged, torn, or if any items/parts are missing (such as diamonds, pearls, stones,
						etc.), the repairing charges will be deducted from the principal amount, and delivery
						charges will also be deducted.
					</Text>
					<Text mt={'1rem'}>
						To be eligible for a return, the item must be in the same condition as you received it,
						unworn or unused, and in its original packaging. You'll also need to provide the receipt
						or proof of purchase.
					</Text>
					<Text mt={'1rem'}>
						We offer a lifetime exchange with a 5% deduction and a refund with a 10% deduction of
						the original billing amount.
					</Text>
					<Text mt={'1rem'}>
						To initiate a return, please contact us at keethjewels@gmail.com or call us at
						9205893607.
					</Text>
				</Box>
			</VStack>
		</section>
	);
}
