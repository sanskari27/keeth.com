import { Types } from 'mongoose';
import { AccountDB } from '../../db';
import CheckoutDB from '../../db/repo/Checkout';
import { ORDER_STATUS, TRANSACTION_STATUS } from '../config/const';
import CustomError, { COMMON_ERRORS, ORDER_ERRORS } from '../errors';
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
	payment_method: 'cod' | 'prepaid';
};

const YEARS_10 = 315360000000;

export default class CheckoutService {
	private _cart?: CartService;
	private _transactionId: Types.ObjectId;

	public constructor(transactionId: Types.ObjectId, cart?: CartService) {
		this._transactionId = transactionId;
		this._cart = cart;
	}

	static async generateTotalStats() {
		const totalStatsPipeline = [
			{
				$group: {
					_id: null,
					totalOrders: { $sum: 1 },
					totalGrossSales: { $sum: '$gross_total' },
					totalDiscounts: { $sum: '$discount' },
					totalCouponDiscounts: { $sum: '$couponDiscount' },
					totalAmountCollected: { $sum: '$total_amount' },
					uniqueCustomers: { $addToSet: '$email' },
				},
			},
			{
				$project: {
					_id: 0,
					totalOrders: 1,
					totalGrossSales: 1,
					totalDiscounts: 1,
					totalCouponDiscounts: 1,
					totalAmountCollected: 1,
					uniqueCustomersCount: { $size: '$uniqueCustomers' },
				},
			},
		];

		try {
			const data = await CheckoutDB.aggregate(totalStatsPipeline);
			if (data.length === 0) {
				throw new Error();
			}
			return {
				totalOrders: data[0].totalOrders as number,
				totalGrossSales: data[0].totalGrossSales as number,
				totalDiscounts: data[0].totalDiscounts as number,
				totalCouponDiscounts: data[0].totalCouponDiscounts as number,
				totalAmountCollected: data[0].totalAmountCollected as number,
				uniqueCustomersCount: data[0].uniqueCustomersCount as number,
			};
		} catch (err) {
			throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
		}
	}

	static async generateMonthStats(startMonth: Date, endMonth: Date) {
		try {
			const data = await CheckoutDB.aggregate([
				{
					$match: {
						transaction_date: { $gte: startMonth, $lt: endMonth },
					},
				},
				{
					$group: {
						_id: {
							year: { $year: '$transaction_date' },
							month: { $month: '$transaction_date' },
						},
						totalOrders: { $sum: 1 },
						totalGrossSales: { $sum: '$gross_total' },
						totalDiscounts: { $sum: '$discount' },
						totalCouponDiscounts: { $sum: '$couponDiscount' },
						totalAmountCollected: { $sum: '$total_amount' },
						uniqueCustomers: { $addToSet: '$email' },
					},
				},
				{
					$project: {
						year: '$_id.year',
						month: '$_id.month',
						totalOrders: 1,
						totalGrossSales: 1,
						totalDiscounts: 1,
						totalCouponDiscounts: 1,
						totalAmountCollected: 1,
						uniqueCustomers: 1,
					},
				},
				// {
				// 	$group: {
				// 		_id: { year: '$year', month: '$month' },
				// 		totalOrders: { $sum: '$totalOrders' },
				// 		totalGrossSales: { $sum: '$totalGrossSales' },
				// 		totalDiscounts: { $sum: '$totalDiscounts' },
				// 		totalCouponDiscounts: { $sum: '$totalCouponDiscounts' },
				// 		totalAmountCollected: { $sum: '$totalAmountCollected' },
				// 		uniqueCustomers: { $addToSet: '$uniqueCustomers' },
				// 	},
				// },
				{
					$sort: { '_id.year': -1, '_id.month': -1 }, // Sort by year and month in descending order
				},
				{
					$project: {
						_id: 0,
						year: '$_id.year',
						month: '$_id.month',
						totalOrders: 1,
						totalGrossSales: 1,
						totalDiscounts: 1,
						totalCouponDiscounts: 1,
						totalAmountCollected: 1,
						uniqueCustomersCount: { $size: '$uniqueCustomers' },
					},
				},
			]);

			if (data.length === 0) {
				throw new Error();
			}

			return data.map((item) => ({
				totalOrders: item.totalOrders as number,
				totalGrossSales: item.totalGrossSales as number,
				totalDiscounts: item.totalDiscounts as number,
				totalCouponDiscounts: item.totalCouponDiscounts as number,
				totalAmountCollected: item.totalAmountCollected as number,
				year: item.year as number,
				month: item.month as number,
				uniqueCustomersCount: item.uniqueCustomersCount as number,
			}));
		} catch (err) {
			throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
		}
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
				payment_method: order.payment_method,
				transaction_date: DateUtils.format(order.transaction_date, 'DD/MM/YYYY'),
				order_status: order.order_status,
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
				order_status: order.order_status,
				tracking_number: order.tracking_number,
				return_tracking_number: order.return_tracking_number,
				payment_method: order.payment_method,
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
			name: order.name,
			email: order.email,
			phone: order.phone,
			amount: order.total_amount,
			gross_amount: order.gross_total,
			discount: order.discount + order.couponDiscount,
			status: order.transaction_status,
			transaction_date: DateUtils.format(order.transaction_date, 'DD/MM/YYYY'),
			order_status: order.order_status,
			tracking_number: order.tracking_number,
			return_tracking_number: order.return_tracking_number,
			payment_method: order.payment_method,
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
			!this._cart ||
			!transaction ||
			![TRANSACTION_STATUS.UNINITIALIZED, TRANSACTION_STATUS.PENDING].includes(
				transaction.transaction_status
			)
		) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (transaction.payment_method === 'cod') {
			transaction.order_status = ORDER_STATUS.PLACED;
			transaction.expireAt = new Date(Date.now() + YEARS_10);
			await transaction.save();
			return null;
		}

		transaction.transaction_status = TRANSACTION_STATUS.PENDING;
		transaction.expireAt = new Date(Date.now() + YEARS_10);
		transaction.provider_id = generateTransactionID();
		await transaction.save();

		const order = await PhonePeProvider.orders.createOrder({
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
				!this._cart ||
				!transaction ||
				!transaction.provider_id ||
				transaction.transaction_status !== TRANSACTION_STATUS.PENDING
			) {
				return 'NOT_FOUND';
			}

			const order = await PhonePeProvider.orders.getOrderStatus(transaction.provider_id);
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

	public async markCODCompleted() {
		const transaction = await CheckoutDB.findById(this._transactionId);
		if (!transaction || transaction.transaction_status !== TRANSACTION_STATUS.PENDING) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		} else if (transaction.payment_method !== 'cod') {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		transaction.transaction_status = TRANSACTION_STATUS.SUCCESS;
		await transaction.save();
	}

	async cancelOrder() {
		const doc = await CheckoutDB.findById(this._transactionId);
		if (!doc) {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (doc.transaction_status !== TRANSACTION_STATUS.SUCCESS) {
			doc.order_status = ORDER_STATUS.CANCELLED;
			await doc.save();
			return;
		}

		if (doc.order_status !== ORDER_STATUS.PLACED) {
			return new CustomError(ORDER_ERRORS.ORDER_NOT_CANCELLED);
		}

		doc.order_status = ORDER_STATUS.CANCELLED;
		doc.refund_id = generateTransactionID();
		await doc.save();

		await PhonePeProvider.refunds.createRefund({
			amount: doc.total_amount,
			order_id: doc.provider_id,
			reference_id: doc.refund_id,
		});
	}

	async requestReturn() {
		const doc = await CheckoutDB.findById(this._transactionId);
		if (!doc) {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		} else if (doc.order_status !== ORDER_STATUS.DELIVERED) {
			return new CustomError(ORDER_ERRORS.RETURN_FAILED);
		}

		doc.order_status = ORDER_STATUS.RETURN_RAISED;
		await doc.save();
	}

	async cancelReturnRequest() {
		const doc = await CheckoutDB.findById(this._transactionId);
		if (!doc) {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		} else if (doc.order_status !== ORDER_STATUS.RETURN_RAISED) {
			return new CustomError(ORDER_ERRORS.RETURN_FAILED);
		}

		doc.order_status = ORDER_STATUS.DELIVERED;
		await doc.save();
	}

	async acceptReturn() {
		const doc = await CheckoutDB.findById(this._transactionId);
		if (!doc || doc.order_status !== ORDER_STATUS.RETURN_RAISED) {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		doc.order_status = ORDER_STATUS.RETURN_ACCEPTED;
		await doc.save();
	}

	async rejectReturn() {
		const doc = await CheckoutDB.findById(this._transactionId);
		if (!doc || doc.order_status !== ORDER_STATUS.RETURN_RAISED) {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		doc.order_status = ORDER_STATUS.RETURN_DENIED;
		await doc.save();
	}

	async setTrackingID(tracking_number: string) {
		const doc = await CheckoutDB.findById(this._transactionId);
		if (!doc) {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (doc.order_status === ORDER_STATUS.SHIPPED) {
			doc.tracking_number = tracking_number;
		} else if (doc.order_status === ORDER_STATUS.RETURN_INITIATED) {
			doc.return_tracking_number = tracking_number;
		} else {
			return new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await doc.save();
	}

	async changeOrderStatus(status: ORDER_STATUS) {
		const updates = await CheckoutDB.updateOne(
			{ _id: this._transactionId },
			{
				$set: {
					order_status: status,
				},
			}
		);

		return updates.modifiedCount !== 0;
	}

	public static async confirmPayment(transactionId: Types.ObjectId, payment_provider_id: string) {
		const updates = await CheckoutDB.updateOne(
			{ _id: transactionId },
			{
				$set: {
					transaction_status: TRANSACTION_STATUS.SUCCESS,
					order_status: ORDER_STATUS.PLACED,
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
