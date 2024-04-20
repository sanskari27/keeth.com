import { Document, Types } from 'mongoose';
import { TRANSACTION_STATUS } from '../../src/config/const';

export default interface ICheckout extends Document {
	linked_to: Types.ObjectId;
	email: string;
	phone: string;
	name: string;
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;

	products: ICheckoutProduct[];

	gross_total: number;
	discount: number;
	couponCode: string;
	couponDiscount: number;
	total_amount: number;

	payment_id: string;
	transaction_date: Date;
	transaction_status: TRANSACTION_STATUS;

	expireAt: Date;
}

export interface ICheckoutProduct extends Document {
	productId: Types.ObjectId;
	productOptionId: Types.ObjectId;
	productCode: string;
	name: string;
	description: string;
	details: string;
	size: string;
	image: string;
	price: number;
	discount: number;
	quantity: number;
}
