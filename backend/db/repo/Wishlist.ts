import mongoose, { Schema } from 'mongoose';
import IWishlist from '../types/wishlist';
import { AccountDB_name } from './Account';
import { ProductDB_name } from './Product';

export const WishlistDB_name = 'Wishlist';

const schema = new mongoose.Schema<IWishlist>({
	account: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		unique: true,
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: ProductDB_name,
		},
	],
});

const WishlistDB = mongoose.model<IWishlist>(WishlistDB_name, schema);

export default WishlistDB;
