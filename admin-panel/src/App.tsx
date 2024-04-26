import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Image, Progress } from '@chakra-ui/react';
import { LOGO } from './assets/Images';
import { useNavbar } from './hooks/useNavbar';
import useUserData from './hooks/useUserData';

const CreateCollection = lazy(() => import('./views/pages/collections/CreateCollection'));
const EditCollection = lazy(() => import('./views/pages/collections/EditCollection'));
const Login = lazy(() => import('./views/pages/login'));
const Home = lazy(() => import('./views/pages/home'));
const PageNotFound = lazy(() => import('./views/pages/not-found'));
const Collections = lazy(() => import('./views/pages/collections'));
const Products = lazy(() => import('./views/pages/products'));
const ProductDetails = lazy(() => import('./views/pages/products/ProductDetails'));
const ProductCustomizations = lazy(() => import('./views/pages/products/ProductCustomizations'));
const ProductGroups = lazy(() => import('./views/pages/product-groups'));
const ProductGroupDetails = lazy(() => import('./views/pages/product-groups/ProductGroupDetails'));
const Coupons = lazy(() => import('./views/pages/coupons'));
const CouponDetails = lazy(() => import('./views/pages/coupons/CouponDetails'));
const Carts = lazy(() => import('./views/pages/abandoned-carts'));
const Users = lazy(() => import('./views/pages/users'));
const Orders = lazy(() => import('./views/pages/orders'));

function App() {
	useUserData();
	useNavbar();
	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background '>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={NAVIGATION.LOGIN} element={<Login />} />
						<Route path={NAVIGATION.HOME} element={<Home />}>
							<Route path={NAVIGATION.COLLECTIONS} element={<Collections />}>
								<Route path={'new'} element={<CreateCollection />} />
								<Route path={'edit/:id'} element={<EditCollection />} />
							</Route>

							<Route path={NAVIGATION.PRODUCT} element={<Products />}>
								<Route path={`new`} element={<ProductDetails />} />
								{/* clone_product_id as optional parameter */}
								<Route path={`:productCode/edit/:id?`} element={<ProductDetails />} />{' '}
								<Route path={`:productCode`} element={<ProductCustomizations />} />
							</Route>

							<Route path={NAVIGATION.PRODUCT_GROUP} element={<ProductGroups />}>
								<Route path={`new`} element={<ProductGroupDetails />} />
								<Route path={`:id`} element={<ProductGroupDetails />} />{' '}
							</Route>

							<Route path={NAVIGATION.COUPONS} element={<Coupons />}>
								<Route path={`new`} element={<CouponDetails />} />
								<Route path={`:id`} element={<CouponDetails />} />
							</Route>

							<Route path={NAVIGATION.ORDERS} element={<Orders />}>
								<Route path={`:id`} element={<CouponDetails />} />
							</Route>

							<Route path={NAVIGATION.ABANDONED_CARTS} element={<Carts />} />
							<Route path={NAVIGATION.USERS} element={<Users />} />
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
				<Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
					<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
						<Image src={LOGO} width={'280px'} className='shadow-lg rounded-full animate-pulse' />
					</Flex>
					<Progress size='xs' isIndeterminate width={'150%'} rounded={'lg'} marginTop={'-3rem'} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default App;
