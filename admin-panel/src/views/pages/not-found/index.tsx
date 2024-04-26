import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LOGO } from '../../../assets/Images';
import { NAVIGATION } from '../../../config/const';

const PageNotFound = () => {
	return (
		<Flex
			minHeight='100vh'
			minWidth='100vw'
			align='center'
			justify='center'
			direction='column'
			textAlign='center'
			padding='8'
		>
			<Link to={NAVIGATION.HOME}>
				<Image src={LOGO} width={'150px'} className='shadow-lg rounded-full' />
			</Link>
			<Heading as='h1' size='xl' mt='-9'>
				Page Not Found
			</Heading>
			<Text mt='4' fontSize='lg'>
				Sorry, the page you're looking for does not exist.
			</Text>
		</Flex>
	);
};

export default PageNotFound;
