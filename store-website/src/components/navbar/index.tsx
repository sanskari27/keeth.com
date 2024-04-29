'use client';
import useOutsideClick from '@/hooks/useOutsideClick';
import { KEETH_LOGO } from '@/lib/const';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BiCategoryAlt } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrContactInfo } from 'react-icons/gr';
import { HiTemplate } from 'react-icons/hi';
import { RiHomeLine } from 'react-icons/ri';

const Navbar = () => {
	const pathname = usePathname();
	const [isNavbarExpanded, setNavbarExpanded] = useState(false);

	const outsideRef = useOutsideClick(() => setNavbarExpanded(false));

	const toggleNavbar = () => setNavbarExpanded((prev) => !prev);

	const isActive = (path: string) => (path === '/' ? path === pathname : pathname.includes(path));

	return (
		<div ref={outsideRef}>
			<nav className='navbar mt-4 h-[60px] border-gray-300 border'>
				<div className='flex items-center px-4 h-full justify-start md:justify-between'>
					<div className='w-full md:w-fit h-full flex justify-between space-x-32 items-center'>
						<a href='/'>
							<Image src={KEETH_LOGO} alt='Keeth Logo' width={100} height={30} priority />
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
									<a href='/contact-us'>Contact Us</a>
								</li>
							</ul>
						</div>
						<div className='md:hidden inline-block'>
							<button onClick={toggleNavbar}>
								<GiHamburgerMenu fontSize={'1.5rem'} />
							</button>
						</div>
					</div>
					<div className='md:inline-block hidden'>
						<ul className='flex gap-6'>
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
									isActive('/cart') && 'nav-active-bottom'
								}`}
							>
								<a href='/cart'>
									<FiShoppingCart fontSize={'1.5rem'} color={isActive('/') ? 'white' : 'black'} />
								</a>
							</li>

							<li
								className={`relative cursor-pointer font-medium ${
									isActive('/profile') && 'nav-active-bottom'
								}`}
							>
								<a href='/profile'>
									<CgProfile fontSize={'1.5rem'} color={isActive('/') ? 'white' : 'black'} />
								</a>
							</li>
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
										<RiHomeLine fontSize={'1rem'} /> Home
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/products') && 'nav-active font-bold'
									}`}
								>
									<a href='/products' className='flex gap-3 items-center'>
										<HiTemplate fontSize={'1rem'} /> Products
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/categories') && 'nav-active font-bold'
									}`}
								>
									<a href='/categories' className='flex gap-3 items-center'>
										<BiCategoryAlt fontSize={'1rem'} /> Categories
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/contact-us') && 'nav-active font-bold'
									}`}
								>
									<a href='/contact-us' className='flex gap-3 items-center'>
										<GrContactInfo fontSize={'1rem'} /> Contact Us
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/wishlist') && 'nav-active-bottom font-bold'
									}`}
								>
									<a href='/wishlist' className='flex gap-3 items-center '>
										<FaRegHeart fontSize={'1rem'} /> Wishlist
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/cart') && 'nav-active-bottom font-bold'
									}`}
								>
									<a href='/cart' className='flex gap-3 items-center'>
										<FiShoppingCart fontSize={'1rem'} /> Cart
									</a>
								</li>

								<li
									className={`relative cursor-pointer font-medium ${
										isActive('/profile') && 'nav-active-bottom font-bold'
									}`}
								>
									<a href='/profile' className='flex gap-3 items-center'>
										<CgProfile fontSize={'1rem'} /> Profile
									</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			) : null}
		</div>
	);
};

export default Navbar;
