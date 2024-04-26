import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import {
	ADMIN_AUTH_COOKIE,
	ADMIN_EMAIL,
	ADMIN_PASSWORD,
	AUTH_COOKIE,
	GOOGLE_AUTH_PASSWORD,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	IS_PRODUCTION,
	SESSION_COOKIE,
} from '../../config/const';
import CustomError, { COMMON_ERRORS, ERRORS } from '../../errors';
import { SessionService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { GoogleLoginValidationResult, LoginValidationResult } from './session.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

async function listUsers(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			users: await SessionService.listUser(),
		},
	});
}

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
		sameSite: 'strict',
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
	const { email, password, type } = req.locals.data as LoginValidationResult;

	if (type === 'admin') {
		if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
			return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
		}

		res.cookie(AUTH_COOKIE, ADMIN_AUTH_COOKIE, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
		});

		return Respond({
			res,
			status: 200,
		});
	}
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

async function googleLogin(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	try {
		const ticket = await client.verifyIdToken({
			idToken: (req.locals.data as GoogleLoginValidationResult).token,
			audience: GOOGLE_CLIENT_ID, // Replace with your client ID
		});

		const payload = ticket.getPayload();
		if (!payload || !payload['email']) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}
		const email = payload['email'];
		const [token, new_session] = await SessionService.login(email, GOOGLE_AUTH_PASSWORD);

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

async function logout(req: Request, res: Response, next: NextFunction) {
	res.clearCookie(SESSION_COOKIE);
	res.clearCookie(AUTH_COOKIE);
	res.clearCookie(ADMIN_AUTH_COOKIE);
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	validateAuth,
	login,
	googleLogin,
	register,
	createSession,
	logout,
	listUsers,
};

export default Controller;
