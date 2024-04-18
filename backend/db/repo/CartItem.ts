import mongoose, { Schema } from 'mongoose';
import ICartItem from '../types/cart-item';
import { ProductDB_name } from './Product';
import { ProductOptionDB_name } from './ProductOption';

export const CartItemDB_name = 'CartItem';

const schema = new mongoose.Schema<ICartItem>({
	quantity: { type: Number, default: 1 },
	cart_id: {
		type: Schema.Types.ObjectId,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: ProductDB_name,
	},
	productOption: {
		type: Schema.Types.ObjectId,
		ref: ProductOptionDB_name,
	},
});

const CartItemDB = mongoose.model<ICartItem>(CartItemDB_name, schema);

export default CartItemDB;
