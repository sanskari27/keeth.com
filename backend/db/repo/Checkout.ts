import mongoose, { Schema } from 'mongoose';
import { TRANSACTION_STATUS } from '../../src/config/const';
import ICheckout, { ICheckoutProduct } from '../types/checkout';

export const CheckoutDB_name = 'Checkout';

const productSchema = new mongoose.Schema<ICheckoutProduct>({
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	productOptionId: {
		type: Schema.Types.ObjectId,
		ref: 'ProductOption',
		required: true,
	},
	productCode: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: '',
	},
	image: String,
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	discount: {
		type: Number,
		default: 0,
		min: 0,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	metal_color: {
		type: String,
		required: true,
	},
	metal_type: {
		type: String,
		required: true,
	},
	metal_quality: {
		type: String,
		required: true,
	},
	diamond_type: {
		type: String,
		required: true,
	},
});

const schema = new mongoose.Schema<ICheckout>({
	linked_to: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	email: String,
	phone: String,
	name: String,
	address_line_1: String,
	address_line_2: String,
	address_line_3: String,
	street: String,
	city: String,
	state: String,
	country: String,
	postal_code: String,

	products: {
		type: [productSchema],
		auto: false,
	},
	gross_total: {
		type: Number,
		required: true,
		default: 0,
		min: 0,
	},
	discount: {
		type: Number,
		default: 0,
		min: 0,
	},
	couponCode: {
		type: String,
		default: '',
	},
	couponDiscount: {
		type: Number,
		default: 0,
		min: 0,
	},
	total_amount: {
		type: Number,
		required: true,
		default: 0,
		min: 0,
	},
	payment_id: String,
	transaction_date: {
		type: Date,
		required: true,
		default: Date.now,
	},
	transaction_status: {
		type: String,
		enum: Object.values(TRANSACTION_STATUS),
		default: TRANSACTION_STATUS.PENDING,
	},
	expireAt: {
		type: Date,
		required: true,
		default: () => {
			return Date.now() + 20 * 60 * 1000;
		},
		index: true,
		expires: 0, // Documents will expire when the time specified in 'expireAt' is reached
	},
});

const CheckoutDB = mongoose.model<ICheckout>(CheckoutDB_name, schema);

export default CheckoutDB;
