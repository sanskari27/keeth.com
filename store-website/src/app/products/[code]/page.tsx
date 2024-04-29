import CollectionBar from '@/components/collectionBar';
import ProductPreview from '@/components/products/imagePreview';
import { Box, Flex, VStack } from '@chakra-ui/react';

export default function About({ params }: { params: { code: string } }) {
	return (
		<section>
			<Box width='full' pt={'80px'} pb={'1rem'} gap={'1rem'}>
				<CollectionBar />

				<Flex px={'5%'}>
					<Box>
						<VStack width={'full'}>
							<ProductPreview
								images={[
									'collections/81c2e586-aa8c-4bd6-8991-45744d8a2658.webp',
									'collections/9c28a5ff-8db3-48ad-999c-7a23d2028034.png',
									'collections/81c2e586-aa8c-4bd6-8991-45744d8a2658.webp',
								]}
								videos={[
									'products/4daabaad-1459-4a0c-96d0-a411da3dd3a9.mp4',
									'products/4daabaad-1459-4a0c-96d0-a411da3dd3a9.mp4',
								]}
							/>
						</VStack>
					</Box>
					<Box></Box>
				</Flex>
			</Box>
		</section>
	);
}
