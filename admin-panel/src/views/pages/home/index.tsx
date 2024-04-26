import { Box, Flex, Image } from '@chakra-ui/react';
import { Navigate, useOutlet } from 'react-router-dom';
import { LOGO } from '../../../assets/Images';
import { NAVIGATION } from '../../../config/const';
import { useAuth } from '../../../hooks/useAuth';
import '../../../index.css';
import Loading from '../../components/loading';
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
