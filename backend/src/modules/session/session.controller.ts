import { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE, IS_PRODUCTION, SESSION_COOKIE } from '../../config/const';
import CustomError, { ERRORS } from '../../errors';
import { SessionService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { LoginValidationResult } from './session.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function createSession(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];

	if (_session_id) {
		try {
			await SessionService.getSession(_session_id);
			return Respond({
				res,
				status: 200,
			});
		} catch (err) {
			//ignored
		}
	}

	const session = await SessionService.createSession();

	res.cookie(SESSION_COOKIE, session.id, {
		sameSite: 'none',
		expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
	});

	return Respond({
		res,
		status: 200,
	});
}

async function login(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	const { email, password } = req.locals.data as LoginValidationResult;
	try {
		const [token, new_session] = await SessionService.login(email, password);

		res.clearCookie(SESSION_COOKIE);
		res.cookie(AUTH_COOKIE, token, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
		});

		if (_session_id) {
			await SessionService.copySession(_session_id, new_session);
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function register(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	const { email, password } = req.locals.data as LoginValidationResult;
	try {
		const [token, new_session] = await SessionService.register(email, password);

		res.cookie(AUTH_COOKIE, token, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
		});

		if (_session_id) {
			await SessionService.copySession(_session_id, new_session);
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	validateAuth,
	login,
	register,
	createSession,
};

export default Controller;
