import mongoose, { Schema } from 'mongoose';
import ISession from '../types/session';
import { CartItemDB_name } from './CartItem';

export const SessionDB_name = 'Session';

const schema = new mongoose.Schema<ISession>({
	cartItems: [
		{
			type: Schema.Types.ObjectId,
			ref: CartItemDB_name,
		},
	],
});

const SessionDB = mongoose.model<ISession>(SessionDB_name, schema);

export default SessionDB;
