export const DATABASE_URL = process.env.DATABASE_URL as string;

export const CHROMIUM_PATH = process.env.CHROMIUM_PATH as string;

export const IS_PRODUCTION = process.env.MODE === 'production';

export const IS_WINDOWS = process.env.OS === 'WINDOWS';

export const PORT = process.env.PORT !== undefined ? process.env.PORT : undefined;
export const SALT_FACTOR = Number(process.env.SALT_FACTOR) ?? 0;
export const JWT_SECRET = process.env.JWT_SECRET ?? 'hello';
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'world';
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '3m';
export const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE ?? '30days';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE = 'session_id';
export const JWT_COOKIE = 'jwt';
export const JWT_REFRESH_COOKIE = 'jwt_refresh';

export enum TRANSACTION_STATUS {
	SUCCESS = 'success',
	FAILED = 'failed',
	PENDING = 'pending',
	CANCELLED = 'cancelled',
	RECURRING = 'recurring',
}

export const TAX = 0.18;

export const MISC_PATH = '/static/misc/';

export const CACHE_TIMEOUT = 60 * 60; //seconds
export const REFRESH_CACHE_TIMEOUT = 30 * 24 * 60 * 60; //seconds

export const CACHE_TOKEN_GENERATOR = {};
