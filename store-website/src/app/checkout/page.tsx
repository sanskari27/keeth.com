import { redirect } from 'next/navigation';

export default function Wishlist() {
	redirect('/cart');

	return <></>;
}
