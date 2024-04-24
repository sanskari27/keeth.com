import { Box, Flex, Icon, IconButton, Image, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { AiOutlineDashboard, AiOutlineGold } from 'react-icons/ai';
import { IoBagHandleOutline } from 'react-icons/io5';
import { LiaSitemapSolid } from 'react-icons/lia';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { PiUsersBold } from 'react-icons/pi';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { LOGO } from '../../../assets/Images';
import { NAVIGATION } from '../../../config/const';
import { logout } from '../../../hooks/useAuth';

function isActiveTab(tab: string, path: string): boolean {
	if (path.includes(tab)) return true;
	return false;
}

export default function NavigationDrawer() {
	const handleLogout = async () => {
		logout();
	};

	return (
		<Box>
			<Flex
				direction={'column'}
				// alignItems={'center'}
				width={'200px'}
				userSelect={'none'}
				position={'fixed'}
				minHeight={'100vh'}
				borderRightWidth={'thin'}
				borderRightColor={'gray.300'}
				paddingY={'0.75rem'}
				zIndex={99}
				background={'white'}
			>
				<Box
					borderBottomWidth={'thin'}
					borderBottomColor={'gray.300'}
					paddingBottom={'0.75rem'}
					width={'100%'}
					height={'50px'}
					paddingLeft={'15px'}
				>
					<Image src={LOGO} width={'36px'} className='shadow-lg rounded-full' />
				</Box>
				<Flex
					direction={'column'}
					height={'calc(100vh - 50px)'}
					overflowY={'auto'}
					paddingBottom={'1rem'}
					flexGrow={1}
				>
					<Box flexGrow={'1'}>
						<Flex flexDirection={'column'} paddingY={'0.5rem'} paddingX={'0.5rem'} gap={'0.25rem'}>
							<MenuButton icon={AiOutlineDashboard} route={NAVIGATION.HOME} name='Dashboard' />
							<MenuButton
								icon={MdOutlineCollectionsBookmark}
								route={NAVIGATION.COLLECTIONS}
								name='Collections'
							/>
							<MenuButton icon={AiOutlineGold} route={NAVIGATION.PRODUCT} name='SKU' />
							<MenuButton
								icon={LiaSitemapSolid}
								route={NAVIGATION.PRODUCT_GROUP}
								name='SKU Groups'
							/>
							<MenuButton icon={IoBagHandleOutline} route={NAVIGATION.ORDERS} name='Orders' />
							<MenuButton icon={PiUsersBold} route={NAVIGATION.USERS} name='Users' />
						</Flex>
					</Box>
					<VStack alignItems={'flex-start'} pl={4}>
						<IconButton
							aria-label='Logout'
							color={'black'}
							icon={<TbLogout2 />}
							onClick={handleLogout}
							className='focus:outline-none focus:border-none rotate-180'
							backgroundColor={'transparent'}
							_hover={{
								backgroundColor: 'transparent',
								border: 'none',
								outline: 'none',
							}}
						/>
					</VStack>
				</Flex>
			</Flex>
		</Box>
	);
}

type MenuButtonProps = {
	route: string;
	icon: IconType;
	name: string;
};

function MenuButton({ route, icon, name }: MenuButtonProps) {
	const navigate = useNavigate();
	return (
		<Flex
			className={`cursor-pointer overflow-hidden
							hover:!shadow-xl  hover:!drop-shadow-lg hover:!bg-green-100 hover:!font-medium 
							${
								isActiveTab(route, location.pathname) &&
								'shadow-xl  drop-shadow-lg bg-green-200 group-hover:shadow-none group-hover:drop-shadow-none group-hover:bg-transparent text-green-900 font-bold'
							}`}
			padding={'1rem'}
			rounded={'lg'}
			gap={'1.1rem'}
			onClick={() => navigate(route)}
		>
			<Icon as={icon} color={'green.400'} width={5} height={5} />
			<Text transition={'none'} className=' text-green-700'>
				{name}
			</Text>
		</Flex>
	);
}
