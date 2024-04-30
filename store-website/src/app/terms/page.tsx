import { AbsoluteCenter, Box, Divider, Text, VStack } from '@chakra-ui/react';

export default async function Terms() {
	return (
		<section>
			<VStack width='86%' mx='auto' pt={'160px'} pb={'1rem'} gap={'1rem'}>
				<Box width={'full'} position='relative'>
					<Divider className='border-2 !border-[#DB3E42] ' />
					<AbsoluteCenter bg='white' px='4'>
						<Text className='aura-bella text-2xl md:text-4xl'>Terms & Conditions</Text>
					</AbsoluteCenter>
				</Box>
				<Box mx='5%' marginTop={'2rem'} textAlign={'justify'} fontSize={'1.1rem'}>
					<Box>
						<Text className='text-[#DB3E42]'>Use of the Website</Text>
						<Text>
							By accessing the website, you warrant and represent to the website owner that you are
							legally entitled to do so and to make use of information made available via the
							website.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Trademarks</Text>
						<Text>
							The trademarks, names, logos and service marks (collectively "trademarks") displayed
							on this website are registered and unregistered trademarks of the website owner.
							Nothing contained on this website should be construed as granting any license or right
							to use any trademark without the prior written permission of the website owner.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>External links</Text>
						<Text>
							External links may be provided for your convenience, but they are beyond the control
							of the website owner and no representation is made as to their content. Use or
							reliance on any external links and the content thereon provided is at your own risk.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Warranties</Text>
						<Text>
							The website owner makes no warranties, representations, statements or guarantees
							(whether express, implied in law or residual) regarding the website.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Prices</Text>
						<Text>
							Our pricing is calculated using current precious metal and gem prices to give you the
							best possible value. These prices do change from time to time, owing to the
							fluctuations in prices of precious metal and gem prices, so our prices change as well.
							Prices on BlueStone.com are subject to change without notice. Please expect to be
							charged the price for the BlueStone merchandise you buy as it is listed on the day of
							purchase.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Disclaimer of liability</Text>
						<Text>
							The website owner shall not be responsible for and disclaims all liability for any
							loss, liability, damage (whether direct, indirect or consequential), personal injury
							or expense of any nature whatsoever which may be suffered by you or any third party
							(including your company), as a result of or which may be attributable, directly or
							indirectly, to your access and use of the website, any information contained on the
							website, your or your company's personal information or material and information
							transmitted over our system. In particular, neither the website owner nor any third
							party or data or content provider shall be liable in any way to you or to any other
							person, firm or corporation whatsoever for any loss, liability, damage (whether direct
							or consequential), personal injury or expense of any nature whatsoever arising from
							any delays, inaccuracies, errors in, or omission of any share price information or the
							transmission thereof, or for any actions taken in reliance thereon or occasioned
							thereby or by reason of non-performance or interruption, or termination thereof. We as
							a merchant shall be under no liability whatsoever in respect of any loss or damage
							arising directly or indirectly out of the decline of authorization for any
							Transaction, on Account of the Cardholder having exceeded the preset limit mutually
							agreed by us with our acquiring bank from time to time.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Conflict of terms</Text>
						<Text>
							If there is a conflict or contradiction between the provisions of these website terms
							and conditions and any other relevant terms and conditions, policies or notices, the
							other relevant terms and conditions, policies or notices which relate specifically to
							a particular section or module of the website shall prevail in respect of your use of
							the relevant section or module of the website.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Severability</Text>
						<Text>
							Any provision of any relevant terms and conditions, policies and notices, which is or
							becomes unenforceable in any jurisdiction, whether due to being void, invalidity,
							illegality, unlawfulness or for any reason whatever, shall, in such jurisdiction only
							and only to the extent that it is so unenforceable, be treated as void and the
							remaining provisions of any relevant terms and conditions, policies and notices shall
							remain in full force and effect.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text className='text-[#DB3E42]'>Cancellation & Returns</Text>
						<Box pl={'2rem'}>
							<Text>
								● You can cancel your order for a product at no cost any time before we send the
								Dispatch Confirmation E-mail relating to that product. You can cancel one order item
								within an order without cancelling the entire order if the order contains 2 or more
								order items.
							</Text>
							<Text>
								● For prepaid orders, the amount will be credited to the payment source (Credit
								Card/Debit Card /Net Banking).
							</Text>
							<Text>
								● Once the product is returned under our 48 hours Money Back policy (not applicable
								on coins) the refund will be credited to your Blue Cash account. You may choose to
								either make another purchase using the same or get the amount refunded to your bank
								account.
								<span className='pl-6 block'>
									● For cash on delivery orders, the refund will be processed to your bank account.
								</span>
								<span className='pl-6 block'>
									● For prepaid orders, the amount will be credited to the payment source (Credit
									Card/Debit Card/Net Banking).
								</span>
							</Text>
							<Text>
								● Upon cancellation/ return of orders placed using gift cards, the gift card amount
								will be refunded back to the gift card.
							</Text>
							<Text>
								● Please visit https://www.keethjewels.com/returns for more details about our
								Returns Policy.
							</Text>
						</Box>
					</Box>
				</Box>
			</VStack>
		</section>
	);
}
