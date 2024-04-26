import { Types } from 'mongoose';
import { CartItemDB, ProductDB } from '../../db';
import AccountDB from '../../db/repo/Account';
import IProduct from '../../db/types/product';
import ProductService from './product';
import SessionService from './session';

export default class CartService {
	private _session: SessionService;

	public constructor(session: SessionService) {
		this._session = session;
	}

	public getSessionId() {
		return this._session.id;
	}

	static async abandonedCarts() {
		const carts = await CartItemDB.aggregate([
			{
				$lookup: {
					from: ProductDB.collection.name,
					localField: 'product',
					foreignField: '_id',
					as: 'product',
				},
			},
			{
				$unwind: {
					path: '$product',
					preserveNullAndEmptyArrays: true, // This will include cart groups even if no matching account user is found
				},
			},
			{
				$group: {
					_id: '$cart_id',
					cartItems: { $push: '$$ROOT' },
				},
			},
			{
				$lookup: {
					from: AccountDB.collection.name,
					localField: '_id',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$unwind: {
					path: '$user',
					preserveNullAndEmptyArrays: true, // This will include cart groups even if no matching account user is found
				},
			},
		]);

		return carts.map((c) => {
			const id = c._id.toString();
			const user = {
				name: c.user.name ?? '',
				phone: c.user.phone ?? '',
				email: c.user.email ?? '',
			};
			const cart_items = c.cartItems.map((item: { quantity: number; product: IProduct }) => ({
				product_id: item.product._id,
				quantity: item.quantity,
				productCode: item.product.productCode,
				name: item.product.name,
				price: item.product.price,
				discount: item.product.discount,
				metal_type: item.product.metal_type,
				metal_color: item.product.metal_color,
				metal_quality: item.product.metal_quality,
				diamond_type: item.product.diamond_type,
				size: item.product.size,
			})) as {
				product_id: Types.ObjectId;
				quantity: number;
				productCode: string;
				name: string;
				metal_type: string;
				metal_color: string;
				metal_quality: string;
				diamond_type: string;
				size: string;
				price: number;
				discount: number;
			}[];

			const gross_amount = cart_items.reduce((acc, item) => {
				const item_total = item.price * item.quantity;
				const discount_total = item.discount * item.quantity;
				acc += item_total - discount_total;
				return acc;
			}, 0);

			return {
				id,
				user,
				cartItems: cart_items,
				grossAmount: gross_amount,
			};
		});
	}

	async getCart() {
		const cartItems = await CartItemDB.find({
			cart_id: this._session.id,
			quantity: { $gt: 0 },
		}).populate<{ product: IProduct }>('product productOption');

		return (
			cartItems.map((c) => ({
				productId: c.product._id,
				productCode: c.product.productCode,
				name: c.product.name,
				description: c.product.description,
				details: c.product.details,
				price: c.product.price,
				size: c.product.size,
				discount: c.product.discount,
				quantity: c.quantity,
				image: c.product.images.length > 0 ? c.product.images[0] : null,
			})) ?? []
		);
	}

	public async addToCart(product_id: Types.ObjectId, quantity = 1) {
		const product = await new ProductService().fetch(product_id);
		if (!product || product.discontinued) {
			return;
		}

		const exists = await CartItemDB.findOne({
			cart_id: this._session.id,
			product: product_id,
		});

		if (!exists) {
			await CartItemDB.create({
				cart_id: this._session.id,
				product: product_id,
				quantity: quantity,
			});
		} else {
			await CartItemDB.updateOne(
				{
					cart_id: this._session.id,
					product: product_id,
				},
				{
					$inc: {
						quantity: quantity,
					},
				}
			);
		}
	}

	public async removeQuantityFromCart(productId: Types.ObjectId, quantity: number = 1) {
		await CartItemDB.updateOne(
			{
				cart_id: this._session.id,
				product: productId,
			},
			{
				$inc: {
					quantity: -1 * quantity,
				},
			}
		);
		const updatedCartItem = await CartItemDB.findOne({
			cart_id: this._session.id,
			product: productId,
		});

		if (updatedCartItem && updatedCartItem.quantity <= 0) {
			await this.removeFromCart(updatedCartItem.product);
		}
	}

	public async removeFromCart(productId: Types.ObjectId) {
		await CartItemDB.deleteOne({
			product: productId,
			cart_id: this._session.id,
		});
	}

	public async emptyCart() {
		await CartItemDB.deleteMany({
			cart_id: this._session.id,
		});
	}
}
