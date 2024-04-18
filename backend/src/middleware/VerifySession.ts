import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
	AUTH_COOKIE,
	IS_PRODUCTION,
	JWT_SECRET,
	SESSION_COOKIE,
	SESSION_EXPIRE_TIME,
} from '../config/const';
import CustomError, { ERRORS } from '../errors';
import SessionService from '../services/session';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	const _auth_id = req.cookies[AUTH_COOKIE];

	if (_auth_id) {
		try {
			const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
			req.locals.session = await SessionService.getSessionByAccount(decoded.id);
			return next();
		} catch (err) {
			//ignored
		}
	}

	if (_session_id) {
		try {
			req.locals.session = await SessionService.getSession(_session_id);
			return next();
		} catch (err) {
			//ignored
		}
	}

	const session = await SessionService.createSession();
	req.locals.session = session;

	res.cookie(SESSION_COOKIE, session.id, {
		sameSite: 'none',
		expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
	});
	next();
}

export async function VerifyAccount(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[AUTH_COOKIE];

	if (_auth_id) {
		try {
			const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
			req.locals.session = await SessionService.getSessionByAccount(decoded.id);
			return next();
		} catch (err) {
			//ignored
		}
	}

	next(new CustomError(ERRORS.USER_ERRORS.SESSION_INVALIDATED));
}
