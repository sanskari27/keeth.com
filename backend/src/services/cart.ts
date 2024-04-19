import { Types } from 'mongoose';
import { CartItemDB } from '../../db';
import IProduct, { IProductOption } from '../../db/types/product';
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
		}).populate<{ product: IProduct; productOption: IProductOption }>('product productOption');

		return (
			cartItems.map((c) => ({
				productId: c.product._id,
				productOptionId: c.productOption._id,
				name: c.product.name,
				description: c.productOption.description,
				productCode: c.productOption.productCode,
				metal_color: c.productOption.metal_color,
				metal_type: c.productOption.metal_type,
				metal_quality: c.productOption.metal_quality,
				diamond_type: c.productOption.diamond_type,
				price: c.productOption.price,
				discount: c.productOption.discount,
				quantity: c.quantity,
				image:
					c.productOption.images.length > 0
						? c.productOption.images[0]
						: c.product.images.length > 0
						? c.product.images[0]
						: null,
			})) ?? []
		);
	}

	public async addToCart(product_id: Types.ObjectId, product_option: Types.ObjectId, quantity = 1) {
		const exists = await CartItemDB.findOne({
			cart_id: this._session.id,
			product: product_id,
			productOption: product_option,
		});

		if (!exists) {
			await CartItemDB.create({
				cart_id: this._session.id,
				product: product_id,
				productOption: product_option,
				quantity: quantity,
			});
		} else {
			await CartItemDB.updateOne(
				{
					cart_id: this._session.id,
					product: product_id,
					productOption: product_option,
				},
				{
					$inc: {
						quantity: quantity,
					},
				}
			);
		}
	}

	public async removeQuantityFromCart(product_option: Types.ObjectId, quantity: number = 1) {
		await CartItemDB.updateOne(
			{
				cart_id: this._session.id,
				productOption: product_option,
			},
			{
				$inc: {
					quantity: -1 * quantity,
				},
			}
		);
		const updatedCartItem = await CartItemDB.findOne({
			cart_id: this._session.id,
			productOption: product_option,
		});

		if (updatedCartItem && updatedCartItem.quantity <= 0) {
			await this.removeFromCart(updatedCartItem.productOption);
		}
	}

	public async removeFromCart(product_option: Types.ObjectId) {
		await CartItemDB.deleteOne({
			productOption: product_option,
			cart_id: this._session.id,
		});
	}
}
