import { NextFunction, Request, Response } from 'express';
import { IS_PRODUCTION, SESSION_COOKIE, SESSION_EXPIRE_TIME } from '../config/const';
import SessionService from '../services/session';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];

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
