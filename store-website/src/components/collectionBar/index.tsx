'use client';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CollectionBar() {
	const searchParams = useSearchParams();
	const collections =
		typeof searchParams.get('collections') === 'string'
			? [searchParams.get('collections')]
			: searchParams.get('collections');

	return (
		<section className='hidden md:block h-[55px] border-b border-b-slate-500 mx-[2%] px-[2%] w-[96%]'>
			<Flex alignItems={'center'} height={'full'} gap={'2rem'}>
				<CollectionItem
					id='rings'
					name='Rings'
					isActive={collections?.includes('rings') || false}
				/>
				<CollectionItem
					id='necklace'
					name='Necklace'
					isActive={collections?.includes('necklace') || false}
				/>
				<CollectionItem
					id='pendants'
					name='pendants'
					isActive={collections?.includes('pendants') || false}
				/>
				<CollectionItem
					id='tanmaniya'
					name='Tanmaniya'
					isActive={collections?.includes('tanmaniya') || false}
				/>

				<CollectionItem
					id='earrings'
					name='EarRings'
					isActive={collections?.includes('earrings') || false}
				/>
				<CollectionItem
					id='bracelet'
					name='Bracelet'
					isActive={collections?.includes('bracelet') || false}
				/>
				<CollectionItem
					id='gifts'
					name='gifts'
					isActive={collections?.includes('gifts') || false}
				/>
				<CollectionItem id='' name='all jewellery' isActive={false} />
			</Flex>
		</section>
	);
}

function CollectionItem({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
	return (
		<Link
			href={{
				pathname: '/products',
				query: {
					collections: id,
				},
			}}
		>
			<Text
				textTransform={'uppercase'}
				fontSize={'1.1rem'}
				fontWeight={'medium'}
				color={isActive ? '#DB3E42' : 'black'}
				className='tracking-wide'
			>
				{name}
			</Text>
		</Link>
	);
}
