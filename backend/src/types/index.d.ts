/* eslint-disable no-var */

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
	data: any;
	id: string;
	session: SessionService;
}

export { IServerError, default as ServerError } from './server-error';
