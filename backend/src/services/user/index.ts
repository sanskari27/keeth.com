import { accountDB } from '../../../db/db';
import CustomError, { ERRORS } from '../../errors';

export default class UserService {
	private phone: string;
	private email: string;
	private name: string;

	public constructor(details: { phone: string; email: string; name: string | null }) {
		this.phone = details.phone;
		this.email = details.email;
		this.name = details.name ?? '';
	}

	static async getService(phone: string) {
		const account = await accountDB.findUnique({
			where: {
				phone,
			},
		});
		if (!account) {
			throw new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return new UserService(account);
	}

	static async createUser(details: { phone: string; email: string; name: string }) {
		try {
			const account = await accountDB.create({
				data: details,
			});
			return new UserService(account);
		} catch (err) {
			throw new CustomError(ERRORS.COMMON_ERRORS.ALREADY_EXISTS);
		}
	}

	getEmail() {
		return this.email;
	}

	getName() {
		return this.name;
	}

	getPhoneNumber() {
		return this.phone;
	}
}
