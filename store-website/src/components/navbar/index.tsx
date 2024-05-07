import { isLoggedIn } from '@/helpers/authHelper';
import NavbarComponent from './components';

const Navbar = async () => {
	const isAuthenticated = await isLoggedIn();

	return <NavbarComponent isAuthenticated={isAuthenticated} />;
};

export default Navbar;
