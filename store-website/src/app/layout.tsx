import Footer from '@/components/footer';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/navbar';

const dm_sans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Keeth',
	description:
		'Welcome to Keeth Jewels, where every piece tells a story of passion, craftsmanship, and beauty. Our journey began with a simple yet profound love for jewellery....',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={dm_sans.className} style={{ backgroundColor: '#FDFDFD' }}>
				<Providers>
					<Navbar />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
