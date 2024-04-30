import { Types } from 'mongoose';
import { WishlistDB } from '../../db';
import IProduct from '../../db/types/product';
import SessionService from './session';

export default class WishlistService {
	private _session: SessionService;

	public constructor(session: SessionService) {
		this._session = session;
	}

	public async crateWishlist() {
		await WishlistDB.create({
			account: this._session.id,
		});
	}

	async getWishlist() {
		const wishlist = await WishlistDB.findOne({
			account: this._session.id,
		}).populate<{ products: IProduct[] }>('products');

		return (
			wishlist?.products.map((product) => ({
				productId: product._id,
				productCode: product.productCode,
				name: product.name,
				description: product.description,
				price: product.price,
				discount: product.discount,
				image: product.images.length > 0 ? product.images[0] : null,
			})) ?? []
		);
	}

	public async contains(product_id: Types.ObjectId) {
		const exists = await WishlistDB.exists({
			account: this._session.id,
			products: product_id,
		});
		return exists !== null;
	}

	public async addToList(product_id: Types.ObjectId) {
		await WishlistDB.updateOne(
			{
				account: this._session.id,
			},
			{
				$addToSet: {
					products: product_id,
				},
			}
		);
	}

	public async removeFromList(product_id: Types.ObjectId) {
		await WishlistDB.updateOne(
			{
				account: this._session.id,
			},
			{
				$pull: {
					products: product_id,
				},
			}
		);
	}
}
