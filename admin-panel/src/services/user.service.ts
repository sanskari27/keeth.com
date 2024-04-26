import APIInstance from '../config/APIInstance';

export default class UserService {
	static async listUsers() {
		try {
			const { data } = await APIInstance.get(`/sessions/users`);
			return data.users as {
				name: string;
				phone: string;
				email: string;
			}[];
		} catch (err) {
			return [];
		}
	}
}
