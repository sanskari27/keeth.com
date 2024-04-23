import { Types } from 'mongoose';
import { CartItemDB } from '../../db';
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
}
