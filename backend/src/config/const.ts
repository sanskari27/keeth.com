export const DATABASE_URL = process.env.DATABASE_URL as string;

export const CHROMIUM_PATH = process.env.CHROMIUM_PATH as string;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const IS_WINDOWS = process.env.OS === 'WINDOWS';
export const GOOGLE_AUTH_PASSWORD = process.env.GOOGLE_AUTH_PASSWORD as string;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL as string;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

export const PORT = process.env.PORT !== undefined ? process.env.PORT : undefined;
export const SALT_FACTOR = Number(process.env.SALT_FACTOR) ?? 0;
export const JWT_SECRET = process.env.JWT_SECRET ?? 'hello';
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'world';
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '30days';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE = 'session_id';
export const TRANSACTION_COOKIE = 'transaction_id';
export const AUTH_COOKIE = 'auth_id';
export const ADMIN_AUTH_COOKIE = 'admin-keeth-jewels';

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
export const RESEND_FEEDBACK_EMAIL = process.env.RESEND_FEEDBACK_EMAIL ?? '';

export enum TRANSACTION_STATUS {
	UNINITIALIZED = 'uninitialized',
	SUCCESS = 'success',
	FAILED = 'failed',
	PENDING = 'pending',
	CANCELLED = 'cancelled',
}

export enum ORDER_STATUS {
	UNINITIALIZED = 'uninitialized',
	PLACED = 'placed',
	CANCELLED = 'cancelled',
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	RETURN_RAISED = 'return-raised',
	RETURN_ACCEPTED = 'return-accepted',
	RETURN_DENIED = 'return-denied',
	RETURN_INITIATED = 'return-initiated',
	REFUND_INITIATED = 'refund-initiated',
	REFUND_COMPLETED = 'refund-completed',
}

export const MISC_PATH = '/static/misc/';
export const COLLECTIONS_PATH = '/static/collections/';
export const PRODUCTS_PATH = '/static/products/';

export const CACHE_TIMEOUT = 60 * 60; //seconds
export const REFRESH_CACHE_TIMEOUT = 30 * 24 * 60 * 60; //seconds

export const CACHE_TOKEN_GENERATOR = {};
