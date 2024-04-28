import Navbar from '@/components/navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

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
			<body className={inter.className} style={{ backgroundColor: '#FDFDFD' }}>
				<Providers>
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
