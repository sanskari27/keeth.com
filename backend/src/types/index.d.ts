/* eslint-disable no-var */

import { Types } from 'mongoose';
import SessionService from '../services/session';

declare global {
	var __basedir: string;
	var __augmont_auth_token: string;

	namespace Express {
		interface Request {
			locals: LocalVariables;
		}
		interface Response {
			locals: LocalVariables;
		}
	}
}
export interface LocalVariables {
	query: any;
	data: any;
	id: Types.ObjectId;
	collection_id: string;
	session: SessionService;
}

export { default as ServerError } from './server-error';
