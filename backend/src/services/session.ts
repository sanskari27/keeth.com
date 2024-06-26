import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { AccountDB, CartItemDB, SessionDB } from '../../db';
import StorageDB from '../../db/repo/Storage';
import CustomError, { ERRORS } from '../errors';
import CartService from './cart';
import WishlistService from './wishlist';

export default class SessionService {
	private _session_id: Types.ObjectId;

	private constructor(session_id: Types.ObjectId) {
		this._session_id = session_id;
	}

	static async getSession(id: Types.ObjectId) {
		const session = await SessionDB.findById(id);
		if (!session) {
			throw new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND);
		}

		return new SessionService(id);
	}

	static async getSessionByAccount(id: Types.ObjectId) {
		const account = await AccountDB.findById(id);
		if (!account) {
			throw new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND);
		}

		return new SessionService(id);
	}

	static async copySession(old_id: Types.ObjectId, new_session: SessionService) {
		const oldCartItems = await CartItemDB.find({ cart_id: old_id });
		const newCart = new CartService(new_session);
		for (const cart_item of oldCartItems) {
			await newCart.addToCart(cart_item.product, cart_item.quantity);
		}
		await CartItemDB.deleteMany({ cart_id: old_id });
	}

	static async login(email: string, password: string) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const password_matched = await user.verifyPassword(password);
		if (!password_matched) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}
		return [user.getSignedToken(), new SessionService(user._id)] as [string, SessionService];
	}

	static async register(email: string, password: string) {
		try {
			const user = await AccountDB.create({ email, password });
			const sessionService = new SessionService(user._id);
			await new WishlistService(sessionService).crateWishlist();
			return [user.getSignedToken(), sessionService] as [string, SessionService];
		} catch (err) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_ALREADY_EXISTS);
		}
	}

	static async loginOrRegister(email: string, password: string, opts: { force?: boolean } = {}) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			return await SessionService.register(email, password);
		}

		const password_matched = await user.verifyPassword(password);
		if (!password_matched && !opts.force) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}
		return [user.getSignedToken(), new SessionService(user._id)] as [string, SessionService];
	}

	static async createSession() {
		const session = await SessionDB.create({});
		return new SessionService(session._id);
	}

	static async listUser() {
		const accounts = await AccountDB.find();

		return accounts.map((acc) => ({
			name: acc.name,
			phone: acc.phone,
			email: acc.email,
		}));
	}

	static async generatePasswordResetLink(email: string) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const token = randomBytes(16).toString('hex');

		await StorageDB.setString(token, user._id.toString());
		return token;
	}

	static async saveResetPassword(token: string, password: string) {
		const id = await StorageDB.getString(token);

		if (!id) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const user = await AccountDB.findOne({ _id: id }).select('+password');
		if (user === null) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}

		user.password = password;
		await user.save();

		await StorageDB.deleteOne({
			key: token,
		});

		return [user.getSignedToken(), new SessionService(user._id)] as [string, SessionService];
	}

	public get id(): Types.ObjectId {
		return this._session_id;
	}

	public async getEmailById(): Promise<string | null> {
		const account = await AccountDB.findById(this._session_id);
		if (!account) return null;
		return account.email;
	}
}
