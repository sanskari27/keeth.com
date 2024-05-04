import { AbsoluteCenter, Box, Divider, Text, VStack } from '@chakra-ui/react';

export default async function PrivacyPolicy() {
	return (
		<section>
			<VStack width='86%' mx='auto' pt={'160px'} pb={'1rem'} gap={'1rem'}>
				<Box width={'full'} position='relative'>
					<Divider className='border-2 !border-[#DB3E42] ' />
					<AbsoluteCenter bg='white' px='4'>
						<Text className='aura-bella text-2xl md:text-4xl'>Privacy Policy</Text>
					</AbsoluteCenter>
				</Box>
				<Box mx='5%' marginTop={'2rem'} textAlign={'justify'} fontSize={'1.1rem'}>
					<Text>
						This Privacy Policy describes how your personal information is collected, used, and
						shared when you visit or make a purchase from our website.
					</Text>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							PERSONAL INFORMATION WE COLLECT
						</Text>
						<Text>
							When you visit the Site, we automatically collect certain information about your
							device, including information about your web browser, IP address, time zone, and some
							of the cookies that are installed on your device. Additionally, as you browse the
							Site, we collect information about the individual web pages or products that you view,
							what websites or search terms referred you to the Site, and information about how you
							interact with the Site. We refer to this automatically-collected information as
							“Device Information”.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							We collect Device Information using the following technologies:
						</Text>
						<ul className='list-disc ml-4 my-2'>
							<li>
								“Cookies” are data files that are placed on your device or computer and often
								include an anonymous unique identifier.
							</li>
							<li>
								“Log files” track actions occurring on the Site, and collect data including your IP
								address, browser type, Internet service provider, referring/exit pages, and
								date/time stamps.
							</li>
							<li>
								“Web beacons”, “tags”, and “pixels” are electronic files used to record information
								about how you browse the Site.
							</li>
						</ul>
					</Box>
					<Box mt={'1rem'}>
						<Text>
							Additionally when you make a purchase or attempt to make a purchase through the Site,
							we collect certain information from you, including your name, billing address,
							shipping address, payment information, email address, and phone number. We refer to
							this information as “Order Information”.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text>
							When we talk about “Personal Information” in this Privacy Policy, we are talking both
							about Device Information and Order Information.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							HOW DO WE USE YOUR PERSONAL INFORMATION?
						</Text>
						<Text>
							We use the Order Information that we collect generally to fulfill any orders placed
							through the Site (including processing your payment information, arranging for
							shipping, and providing you with invoices and/or order confirmations). Additionally,
							we use this Order Information to:
						</Text>
						<ul className='list-disc ml-4 my-2'>
							<li>Communicate with you.</li>
							<li>Screen our orders for potential risk or fraud and</li>
							<li>
								When in line with the preferences you have shared with us, provide you with
								information or advertising relating to our products or services.
							</li>
						</ul>
						<Text>
							We use the Device Information that we collect to help us screen for potential risk and
							fraud (in particular, your IP address), and more generally to improve and optimize our
							Site (for example, by generating analytics about how our customers browse and interact
							with the Site, and to assess the success of our marketing and advertising campaigns).
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							SHARING YOUR PERSONAL INFORMATION
						</Text>
						<ul className='list-disc ml-4 my-2'>
							<li>
								We will never release your personal details to any outside company for mailing or
								marketing purposes. All the information will be handled by our company only.
							</li>
							<li>
								Payments on the website are processed by a secured reputable third party, which
								adheres to the privacy policy that is set out here.
							</li>
						</ul>
						<Text>
							Finally, we may also share your Personal Information to comply with applicable laws
							and regulations, to respond to a subpoena, search warrant or other lawful request for
							information we receive, or to otherwise protect our rights.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							BEHAVIORAL ADVERTISING
						</Text>
						<Text>
							As described above, we may use your Personal Information to provide you with targeted
							advertisements or marketing communications we believe may be of interest to you.
						</Text>
						<Text>
							Additionally, you can opt out of some of these services by visiting the Digital
							Advertising Alliance’s opt-out portal at: http://optout.aboutads.info/.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							DO NOT TRACK
						</Text>
						<Text>
							Please note that we do not alter our Site’s data collection and use practices when we
							see a Do Not Track signal from your browser.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							DATA RETENTION
						</Text>
						<Text>
							When you place an order through the Site, we will maintain your Order Information for
							our records unless and until you ask us to delete this information.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							CHANGES
						</Text>
						<Text>
							We may update this privacy policy from time to time in order to reflect, for example,
							changes to our practices or for other operational, legal or regulatory reasons.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							FRAUDULENT TRANSACTIONS
						</Text>
						<Text>
							We reserve the right to recover the cost of goods, collection charges and lawyers fees
							from persons using the site fraudulently. We reserve the right to initiate legal
							proceedings against such persons for fraudulent use of the Site and any other unlawful
							acts or acts or omissions in breach of these Terms & Conditions.
						</Text>
					</Box>
					<Box mt={'1rem'}>
						<Text fontWeight={'700'} textTransform={'uppercase'}>
							FRAUDULENT TRANSACTIONS
						</Text>
						<Text>
							We reserve the right to recover the cost of goods, collection charges and lawyers fees
							from persons using the site fraudulently. We reserve the right to initiate legal
							proceedings against such persons for fraudulent use of the Site and any other unlawful
							acts or acts or omissions in breach of these Terms & Conditions.
						</Text>
					</Box>
				</Box>
			</VStack>
		</section>
	);
}
