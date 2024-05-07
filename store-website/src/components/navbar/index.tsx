import { isLoggedIn } from '@/helpers/authHelper';
import NavbarComponent from './components';

export const revalidate = 0;

const Navbar = async () => {
	const isAuthenticated = await isLoggedIn();
	console.log('isAuthenticated', isAuthenticated);

	return <NavbarComponent isAuthenticated={isAuthenticated} />;
};

export default Navbar;
