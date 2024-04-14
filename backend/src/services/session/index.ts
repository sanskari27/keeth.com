import { cartItemDB, sessionDB } from '../../config/postgres';
import CustomError, { ERRORS } from '../../errors';

export default class SessionService {
	private _session_id: string;

	private constructor(session_id: string) {
		this._session_id = session_id;
	}

	static async getSession(id: string) {
		const session = await sessionDB.findUnique({
			where: {
				id,
			},
		});
		if (!session) {
			throw new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND);
		}

		return new SessionService(id);
	}

	static async createSession() {
		const session = await sessionDB.create({
			data: {},
			include: {
				cart: true,
			},
		});
		return new SessionService(session.id);
	}

	public get id(): string {
		return this._session_id;
	}

	async getCart() {
		const session = await sessionDB.findUnique({
			where: {
				id: this.id,
			},
			include: {
				cart: {
					include: {
						product: true,
						product_option: true,
					},
				},
			},
		});

		return (
			session?.cart.map((c) => ({
				quantity: c.quantity,
				product: c.product,
				product_option: c.product_option,
			})) ?? []
		);
	}

	public async addToCart(product_id: string, product_option: string) {
		try {
			await cartItemDB.upsert({
				where: {
					sessionId_productOptionId: {
						sessionId: this.id,
						productOptionId: product_option,
					},
				},
				create: {
					quantity: 1,
					product_option: { connect: { id: product_option } },
					product: { connect: { id: product_id } },
					session: { connect: { id: this.id } },
				},
				update: {
					quantity: {
						increment: 1,
					},
				},
				include: {
					product: true,
				},
			});
		} catch (err) {
			console.log(err);
			throw new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND);
		}
	}

	public async removeQuantityFromCart(product_options: string, quantity: number = 1) {
		const cartItem = await cartItemDB.update({
			where: {
				sessionId_productOptionId: {
					sessionId: this.id,
					productOptionId: product_options,
				},
			},
			data: {
				quantity: {
					decrement: quantity,
				},
			},
		});
		if (cartItem.quantity < 1) {
			this.removeFromCart(product_options);
		}
	}

	public async removeFromCart(product_options: string) {
		await cartItemDB.deleteMany({
			where: {
				productOptionId: product_options,
				sessionId: this.id,
			},
		});
	}
}
