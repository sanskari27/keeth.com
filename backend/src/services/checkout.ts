import { Types } from 'mongoose';
import CheckoutDB from '../../db/repo/Checkout';
import { TRANSACTION_STATUS } from '../config/const';
import CustomError, { COMMON_ERRORS } from '../errors';
import PhonePeProvider from '../provider/phonepe';
import CartService from './cart';
import CouponService from './coupon';

type BillingDetails = {
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
};

const YEARS_10 = 315360000000;

export default class CheckoutService {
	private _cart: CartService;
	private _transactionId: Types.ObjectId;

	public constructor(cart: CartService, transactionId: Types.ObjectId) {
		this._cart = cart;
		this._transactionId = transactionId;
	}

	static async startCheckout(cart: CartService) {
		const products = await cart.getCart();

		const { gross_amount, discount } = products.reduce(
			(acc, item) => {
				const item_total = item.price * item.quantity;
				const discount_total = item.discount * item.quantity;
				acc.gross_amount += item_total - discount_total;
				acc.discount += discount_total;
				return acc;
			},
			{ gross_amount: 0, discount: 0 }
		);

		const transaction = await CheckoutDB.create({
			linked_to: cart.getSessionId(),
			products: products.map((p) => ({
				productId: p.productId,
				productOptionId: p.productOptionId,
				productCode: p.productCode,
				name: p.name,
				description: p.description,
				image: p.image,
				price: p.price,
				discount: p.discount,
				quantity: p.quantity,
				metal_color: p.metal_color,
				metal_type: p.metal_type,
				metal_quality: p.metal_quality,
				diamond_type: p.diamond_type,
			})),

			gross_total: gross_amount,
			discount: discount,
			total_amount: gross_amount - discount,
		});

		return transaction._id;
	}

	public async addBillingDetails(details: BillingDetails) {
		const updates = await CheckoutDB.updateOne(
			{
				_id: this._transactionId,
			},
			{
				$set: details,
			}
		);

		return updates.modifiedCount !== 0;
	}

	public async addCoupon(couponCode: string) {
		const coupon = await new CouponService().fetch(couponCode);
		const transaction = await CheckoutDB.findById(this._transactionId);

		if (!coupon || !transaction) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		transaction.couponCode = couponCode;
		transaction.couponDiscount =
			coupon.discountType === 'percentage'
				? coupon.discountPercentage * transaction.gross_total
				: coupon.discountAmount;

		transaction.couponDiscount = Math.min(transaction.couponDiscount, transaction.gross_total);
		transaction.total_amount = transaction.gross_total - transaction.couponDiscount;
	}

	public async removeCoupon() {
		const transaction = await CheckoutDB.findById(this._transactionId);

		if (!transaction) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		transaction.couponCode = '';
		transaction.couponDiscount = 0;
		transaction.total_amount = transaction.gross_total - transaction.couponDiscount;
	}

	public async initiatePayment() {
		const transaction = await CheckoutDB.findById(this._transactionId);

		if (!transaction || transaction.transaction_status !== TRANSACTION_STATUS.PENDING) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const order = await PhonePeProvider.Orders.createOrder({
			amount: transaction.total_amount,
			reference_id: transaction._id.toString(),
			userID: this._cart.getSessionId().toString(),
		});

		return order.transaction_url as string;
	}

	public async verifyPayment() {
		try {
			const order = await PhonePeProvider.Orders.getOrderStatus(this._transactionId.toString());
			const paymentProviderID = order.transaction_id;
			const status = order.status as
				| 'PAYMENT_SUCCESS'
				| 'BAD_REQUEST'
				| 'AUTHORIZATION_FAILED'
				| 'INTERNAL_SERVER_ERROR'
				| 'TRANSACTION_NOT_FOUND'
				| 'PAYMENT_ERROR'
				| 'PAYMENT_PENDING'
				| 'PAYMENT_DECLINED'
				| 'TIMED_OUT';

			switch (status) {
				case 'PAYMENT_SUCCESS':
					await CheckoutService.confirmPayment(this._transactionId, paymentProviderID);
					break;
				case 'PAYMENT_PENDING':
					break;
				default:
					await CheckoutService.failedPayment(this._transactionId);
			}
			return status;
		} catch (err) {
			return 'INTERNAL_SERVER_ERROR';
		}
	}

	public static async confirmPayment(transactionId: Types.ObjectId, payment_provider_id: string) {
		const updates = await CheckoutDB.updateOne(
			{ _id: transactionId },
			{
				$set: {
					transaction_status: TRANSACTION_STATUS.SUCCESS,
					payment_id: payment_provider_id,
					expireAt: Date.now() + YEARS_10,
				},
			}
		);

		return updates.modifiedCount !== 0;
	}

	public static async failedPayment(transactionId: Types.ObjectId) {
		const updates = await CheckoutDB.updateOne(
			{ _id: transactionId },
			{ $set: { transaction_status: TRANSACTION_STATUS.FAILED } }
		);

		return updates.modifiedCount !== 0;
	}
}
