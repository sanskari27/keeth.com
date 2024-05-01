'use client';
import { sendFeedback } from '@/services/session.service';
import { Button, Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';

export default function Feedback() {
	const [value, setValue] = useState('');

	function handleFeedback() {
		if (!value) return;
		sendFeedback(value);
		setValue('');
	}

	return (
		<>
			<Textarea
				variant={'unstyled'}
				placeholder='Write you feedback here, and help us grow!'
				height={'200px'}
				width='full'
				bgColor={'#F2F2F2'}
				rounded={'2xl'}
				resize={'none'}
				p={'1rem'}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			></Textarea>
			<Button
				className='w-[130px] py-6 !bg-accent-light'
				position={'absolute'}
				right={'1rem'}
				bottom={'1rem'}
				rounded={'full'}
				color='white'
				onClick={handleFeedback}
			>
				<Text className='aura-bella text-lg md:text-2xl'>Send</Text>
			</Button>
		</>
	);
}
