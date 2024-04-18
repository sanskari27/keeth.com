import { Document } from 'mongoose';

export default interface IAccount extends Document {
	name: string;
	phone: string;
	email: string;
	password: string;

	verifyPassword(password: string): Promise<boolean>;

	getSignedToken(): string;
}
