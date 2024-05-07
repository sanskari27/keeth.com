'use client';
import useOutsideClick from '@/hooks/useOutsideClick';
import { KEETH_LOGO } from '@/lib/const';
import { isLoggedIn, logOut } from '@/services/session.service';
import { Text } from '@chakra-ui/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegHeart, FaRegUserCircle } from 'react-icons/fa';
import { FiMenu, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
	const pathname = usePathname();

	const [isNavbarExpanded, setNavbarExpanded] = useState(false);
	const [isAuthenticated, setAuthenticated] = useState(
		localStorage ? localStorage.getItem('authenticated') === 'true' : false
	);

	const outsideRef = useOutsideClick(() => setNavbarExpanded(false));

	const toggleNavbar = () => setNavbarExpanded((prev) => !prev);

	const isActive = (path: string) => (path === '/' ? path === pathname : pathname.includes(path));

	const handleLogout = async () => {
		await logOut();
		setAuthenticated(false);
		if (localStorage) {
			localStorage.removeItem('authenticated');
		}
	};

	useEffect(() => {
		isLoggedIn().then((_isAuthenticated) => {
			setAuthenticated(_isAuthenticated);
			if (localStorage) {
				localStorage.setItem('authenticated', _isAuthenticated ? 'true' : 'false');
			}
		});
	}, [pathname]);

	return (
		<div ref={outsideRef}>
			<nav className='navbar mt-4 h-[60px] border-gray-300 border'>
				<div className='flex items-center px-4 h-full justify-start md:justify-between'>
					<div className='w-full md:w-fit h-full flex justify-between space-x-32 items-center'>
						<a href='/'>
							<Image src={KEETH_LOGO} alt='Keeth Logo' width={100} height={30} />
						</a>
						<div className='md:inline-block hidden'>
							<ul className='flex gap-9'>
								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/') && 'nav-active font-bold'
									}`}
								>
									<a href='/'>Home</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/products') && 'nav-active font-bold'
									}`}
								>
									<a href='/products'>Products</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/categories') && 'nav-active font-bold'
									}`}
								>
									<a href='/categories'>Categories</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/contact-us') && 'nav-active font-bold'
									}`}
								>
									<a href='https://wa.me/919205893607' target='_blank'>
										Contact Us
									</a>
								</li>
							</ul>
						</div>
						<div className='md:hidden inline-block'>
							<button onClick={toggleNavbar}>
								<FiMenu fontSize={'1.5rem'} />
							</button>
						</div>
					</div>
					<div className='md:inline-block hidden'>
						<ul className='flex gap-6'>
							<li
								className={`relative cursor-pointer font-medium ${
									isActive('/cart') && 'nav-active-bottom'
								}`}
							>
								<a href='/cart'>
									<FiShoppingCart fontSize={'1.5rem'} color={isActive('/') ? 'white' : 'black'} />
								</a>
							</li>
							{isAuthenticated ? (
								<>
									<li
										className={`relative cursor-pointer font-medium ${
											isActive('/wishlist') && 'nav-active-bottom'
										}`}
									>
										<a href='/wishlist'>
											<FaRegHeart fontSize={'1.5rem'} color={isActive('/') ? 'white' : 'black'} />
										</a>
									</li>
									<li
										className={`relative cursor-pointer font-medium ${
											isActive('/orders') && 'nav-active-bottom'
										}`}
									>
										<a href='/orders'>
											<BsBoxSeam fontSize={'1.5rem'} color={isActive('/') ? 'white' : 'black'} />
										</a>
									</li>
									<li className={`relative cursor-pointer font-medium`}>
										<Text
											className='cursor-pointer'
											onClick={handleLogout}
											color={isActive('/') ? 'white' : 'black'}
										>
											Logout
										</Text>
									</li>
								</>
							) : (
								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/login') && 'nav-active-bottom'
									}`}
								>
									<a
										href={`/login`}
										className={`flex items-center ${isActive('/') ? 'text-white' : 'text-black'}`}
									>
										<FaRegUserCircle
											fontSize={'1.5rem'}
											color={isActive('/') ? 'white' : 'black'}
											className='mr-3'
										/>
										Login
									</a>
								</li>
							)}
						</ul>
					</div>
				</div>
			</nav>

			{isNavbarExpanded ? (
				<nav className='navbar mt-24 md:hidden block'>
					<div className='flex flex-col items-start px-8 py-4 h-full'>
						<div>
							<ul className='flex flex-col gap-2'>
								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/') && 'nav-active font-bold'
									}`}
								>
									<a href='/' className='flex gap-3 items-center'>
										Home
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/products') && 'nav-active font-bold'
									}`}
								>
									<a href='/products' className='flex gap-3 items-center'>
										Products
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/categories') && 'nav-active font-bold'
									}`}
								>
									<a href='/categories' className='flex gap-3 items-center'>
										Categories
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/contact-us') && 'nav-active font-bold'
									}`}
								>
									<a
										href='https://wa.me/919205893607'
										target='_blank'
										className='flex gap-3 items-center'
									>
										Contact Us
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/cart') && 'nav-active-bottom font-bold'
									}`}
								>
									<a href='/cart' className='flex gap-3 items-center'>
										Cart
									</a>
								</li>

								{isAuthenticated ? (
									<>
										<li
											className={`relative cursor-pointer font-medium ${
												isActive('/wishlist') && 'nav-active-bottom font-bold'
											}`}
										>
											<a href='/wishlist' className='flex gap-3 items-center '>
												Wishlist
											</a>
										</li>

										<li
											className={`relative cursor-pointer font-medium ${
												isActive('/orders') && 'nav-active-bottom font-bold'
											}`}
										>
											<a href='/orders' className='flex gap-3 items-center'>
												Orders
											</a>
										</li>
										<li className={`relative cursor-pointer font-medium`}>
											<Text className='cursor-pointer' onClick={handleLogout}>
												Logout
											</Text>
										</li>
									</>
								) : (
									<li
										className={`relative cursor-pointer font-medium ${
											isActive('/orders') && 'nav-active-bottom font-bold'
										}`}
									>
										<a href={`/login`} className='flex gap-3 items-center'>
											Login
										</a>
									</li>
								)}
							</ul>
						</div>
					</div>
				</nav>
			) : null}
		</div>
	);
};

export default Navbar;
