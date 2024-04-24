import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import { Navigate, useOutlet } from 'react-router-dom';
import { LOGO } from '../../../assets/Images';
import { LOTTIE_LOADER } from '../../../assets/Lottie';
import { NAVIGATION } from '../../../config/const';
import { useAuth } from '../../../hooks/useAuth';
import '../../../index.css';
import Navbar from '../../components/navbar';
import NavigationDrawer from '../../components/navigation-drawer';
import Dashboard from '../dashboard';

export default function Home() {
	const outlet = useOutlet();
	const { isAuthenticated, isAuthenticating } = useAuth();

	if (isAuthenticating) {
		return (
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
						<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
							<Image src={LOGO} width={'120px'} className='shadow-lg rounded-full animate-ping' />
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to={NAVIGATION.LOGIN} />;
	}

	return (
		<Box width='full' className='custom-scrollbar'>
			<NavigationDrawer />
			<Navbar />
			<Box paddingLeft={'200px'} paddingTop={'70px'} overflowX={'hidden'} className='min-h-screen'>
				{outlet ? outlet : <Dashboard />}
				<Loading isLoaded={true} />
			</Box>
		</Box>
	);
}

function Loading({ isLoaded }: { isLoaded: boolean }) {
	if (isLoaded) {
		return null;
	}
	return (
		<Flex
			justifyContent={'center'}
			alignItems={'center'}
			direction={'column'}
			position={'fixed'}
			gap={'3rem'}
			height={'100vh'}
			width={'100vw'}
			left={0}
			top={0}
			zIndex={99}
			userSelect={'none'}
			className='bg-black/50'
		>
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				bg={'#f2f2f2'}
				paddingX={'4rem'}
				paddingTop={'4rem'}
				paddingBottom={'2rem'}
				aspectRatio={'1/1'}
				rounded={'lg'}
			>
				<Image src={LOGO} height={'100px'} mixBlendMode={'multiply'} />
				<Lottie animationData={LOTTIE_LOADER} loop={true} />
				<Text mt={'1rem'} className='text-black ' fontSize={'xs'}>
					Data synchronization in progress.
				</Text>
				<Text className='text-black ' fontSize={'xs'}>
					It may take longer to complete.
				</Text>
			</Flex>
		</Flex>
	);
}
