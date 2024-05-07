import { AbsoluteCenter, Box, Divider, Text, VStack } from '@chakra-ui/react';

export const metadata = {
	title: 'About Keeth • Keeth',
};

export default async function About() {
	return (
		<section>
			<VStack width='86%' mx='auto' pt={'160px'} pb={'1rem'} gap={'1rem'}>
				<Box width={'full'} position='relative'>
					<Divider className='border-2 !border-[#DB3E42] ' />
					<AbsoluteCenter bg='white' px='4'>
						<Text className='aura-bella text-2xl md:text-4xl'>About Us</Text>
					</AbsoluteCenter>
				</Box>
				<Box mx='5%' marginTop={'2rem'} textAlign={'justify'} fontSize={'1.1rem'}>
					<Text>
						Welcome to <span className='text-[#DB3E42] px-1'>Keeth</span>
						Jewels, where every piece tells a story of passion, craftsmanship, and beauty.
					</Text>
					<Text marginTop={'1rem'}>
						Our journey began with a simple yet profound love for jewellery. Founded in 2024, Keeth
						Jewels was born out of a desire to create exquisite pieces that reflect the unique
						essence of each individual. What started as a dream soon evolved into a thriving
						reality, fueled by our unwavering commitment to quality, creativity, and authenticity.
						At Keeth, we believe that jewellery is more than just adornment – it's a form of
						self-expression, a symbol of memories, and a treasure to cherish for generations. Our
						mission is to craft jewellery that resonates with the soul, inspiring confidence and
						delight in every wearer. Drawing inspiration from the world around us – from the
						captivating hues of nature to the timeless elegance of art and culture – each collection
						is thoughtfully curated to evoke emotion and captivate the senses. Our designs celebrate
						the beauty of imperfection, embracing the unique character of every gemstone and metal.
						Behind every shimmering gem and intricate detail lies a dedication to craftsmanship that
						knows no bounds. Our artisans bring decades of experience and expertise to every piece,
						employing traditional techniques alongside modern innovation to ensure unparalleled
						quality and precision. At Keeth, our customers are at the heart of everything we do. We
						are dedicated to providing an exceptional experience, from the moment you discover our
						collections to the joy of wearing them every day. Your satisfaction is our ultimate
						reward, and we are honored to be part of your journey. As we look to the future, our
						vision remains clear: to continue creating timeless treasures that inspire and enchant,
						while staying true to our values of integrity, innovation, and excellence.
					</Text>
					<Text marginTop={'1rem'}>
						Thank you for choosing <span className='text-[#DB3E42] px-1'>Keeth</span> to be a part
						of your story. Together, let's adorn the world with beauty.
					</Text>
				</Box>
			</VStack>
		</section>
	);
}
