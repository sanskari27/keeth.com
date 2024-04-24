import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Image, Progress, Text } from '@chakra-ui/react';
import { LOGO } from './assets/Images';
import { useNavbar } from './hooks/useNavbar';
import useUserData from './hooks/useUserData';

const CreateCollection = lazy(() => import('./views/pages/collections/CreateCollection'));
const EditCollection = lazy(() => import('./views/pages/collections/EditCollection'));
const Login = lazy(() => import('./views/pages/login'));
const Home = lazy(() => import('./views/pages/home'));
const PageNotFound = lazy(() => import('./views/pages/not-found'));
const Collections = lazy(() => import('./views/pages/collections'));

function App() {
	useUserData();
	useNavbar();
	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background dark:bg-background-dark'>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={NAVIGATION.LOGIN} element={<Login />} />
						<Route path={NAVIGATION.HOME} element={<Home />}>
							<Route path={NAVIGATION.COLLECTIONS} element={<Collections />}>
								<Route path={'new'} element={<CreateCollection />} />
								<Route path={'edit/:id'} element={<EditCollection />} />
							</Route>
						</Route>
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</Suspense>
			</Router>
		</Flex>
	);
}

const Loading = () => {
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
				<Flex justifyContent={'center'} alignItems={'center'} direction={'column'} gap={'3rem'}>
					<Flex justifyContent={'center'} alignItems={'center'} width={'full'} gap={'1rem'}>
						<Image src={LOGO} width={'48px'} className='shadow-lg rounded-full' />
						<Text className='text-black dark:text-white' fontSize={'lg'} fontWeight='bold'>
							WhatsLeads
						</Text>
					</Flex>
					<Progress size='xs' isIndeterminate width={'150%'} rounded={'lg'} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default App;
