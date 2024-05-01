import { Types } from 'mongoose';
import { AccountDB } from '../../db';
import CheckoutDB from '../../db/repo/Checkout';
import { TRANSACTION_STATUS } from '../config/const';
import CustomError, { COMMON_ERRORS } from '../errors';
import PhonePeProvider from '../provider/phonepe';
import DateUtils from '../utils/DateUtils';
import { generateTransactionID } from '../utils/ExpressUtils';
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

	static async getAllOrders() {
		const orders = await CheckoutDB.find().sort({ transaction_date: -1 });

		return orders.map((order) => {
			const quantity = order.products.reduce((acc, item) => acc + item.quantity, 0);
			return {
				id: order._id.toString(),
				name: order.name,
				phone: order.phone,
				email: order.email,
				quantity,
				amount: order.total_amount,
				couponCode: order.couponCode,
				status: order.transaction_status,
				transaction_date: DateUtils.format(order.transaction_date, 'DD/MM/YYYY'),
			};
		});
	}

	static async getOrders(linked_to: Types.ObjectId) {
		const orders = await CheckoutDB.find({
			linked_to,
			transaction_status: { $ne: TRANSACTION_STATUS.UNINITIALIZED },
		}).sort({ transaction_date: -1 });

		return orders.map((order) => {
			return {
				id: order._id,
				amount: order.total_amount,
				gross_amount: order.gross_total,
				discount: order.discount,
				status: order.transaction_status,
				transaction_date: DateUtils.format(order.transaction_date, 'DD/MM/YYYY'),
				products: order.products.map((p) => ({
					product_id: p.productId,
					description: p.description,
					productCode: p.productCode,
					quantity: p.quantity,
					name: p.name,
					price: p.price,
					discount: p.discount,
					size: p.size,
					metal_type: p.metal_type,
					metal_color: p.metal_color,
					metal_quality: p.metal_quality,
					diamond_type: p.diamond_type,
				})),
			};
		});
	}

	static async startCheckout(cart: CartService) {
		const products = await cart.getCart();
		const account = await AccountDB.findById(cart.getSessionId());

		const { gross_amount, discount } = products.reduce(
			(acc, item) => {
				const item_total = item.price * item.quantity;
				const discount_total = item.discount * item.quantity;
				acc.gross_amount += item_total;
				acc.discount += discount_total;
				return acc;
			},
			{ gross_amount: 0, discount: 0 }
		);

		const transaction = await CheckoutDB.create({
			linked_to: cart.getSessionId(),
			products: products.map((p) => ({
				productId: p.productId,
				productCode: p.productCode,
				name: p.name,
				description: p.description,
				details: p.details,
				size: p.size,
				metal_type: p.metal_type,
				metal_color: p.metal_color,
				metal_quality: p.metal_quality,
				diamond_type: p.diamond_type,
				price: p.price,
				discount: p.discount,
				quantity: p.quantity,
				image: p.image,
			})),
			email: account?.email || 'no_user@gmail.com',
			gross_total: gross_amount,
			discount: discount,
			total_amount: gross_amount - discount,
		});

		return transaction._id;
	}

	async getDetails() {
		const order = await CheckoutDB.findById(this._transactionId);

		if (!order) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return {
			id: order._id.toString(),
			amount: order.total_amount,
			gross_amount: order.gross_total,
			discount: order.discount + order.couponDiscount,
			status: order.transaction_status,
			transaction_date: DateUtils.format(order.transaction_date, 'DD/MM/YYYY'),
			products: order.products.map((p) => ({
				product_id: p.productId,
				productCode: p.productCode,
				quantity: p.quantity,
				name: p.name,
				price: p.price,
				discount: p.discount,
				size: p.size,
				metal_type: p.metal_type,
				metal_color: p.metal_color,
				metal_quality: p.metal_quality,
				diamond_type: p.diamond_type,
			})),
		};
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
				? coupon.discountPercentage * transaction.gross_total * 0.01
				: coupon.discountAmount;

		transaction.couponDiscount = Math.min(transaction.couponDiscount, transaction.gross_total);
		transaction.total_amount = transaction.gross_total - transaction.couponDiscount;
		await transaction.save();
	}

	public async removeCoupon() {
		const transaction = await CheckoutDB.findById(this._transactionId);

		if (!transaction) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		transaction.couponCode = '';
		transaction.couponDiscount = 0;
		transaction.total_amount = transaction.gross_total - transaction.couponDiscount;
		await transaction.save();
	}

	public async initiatePayment() {
		const transaction = await CheckoutDB.findById(this._transactionId);

		if (
			!transaction ||
			![TRANSACTION_STATUS.UNINITIALIZED, TRANSACTION_STATUS.PENDING].includes(
				transaction.transaction_status
			)
		) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		transaction.transaction_status = TRANSACTION_STATUS.PENDING;
		transaction.expireAt = new Date(Date.now() + YEARS_10);
		transaction.provider_id = generateTransactionID();
		await transaction.save();

		const order = await PhonePeProvider.Orders.createOrder({
			amount: transaction.total_amount,
			reference_id: transaction.provider_id,
			userID: this._cart.getSessionId().toString(),
		});

		return order.transaction_url as string;
	}

	public async verifyPayment() {
		try {
			const transaction = await CheckoutDB.findById(this._transactionId);
			if (
				!transaction ||
				!transaction.provider_id ||
				transaction.transaction_status !== TRANSACTION_STATUS.PENDING
			) {
				return 'NOT_FOUND';
			}

			const order = await PhonePeProvider.Orders.getOrderStatus(transaction.provider_id);
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
					await this._cart.emptyCart();
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
