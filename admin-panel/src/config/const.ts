import countries from './countries.json';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const WEBPAGE_URL = import.meta.env.VITE_WEBPAGE_URL;
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
export const DATA_LOADED_DELAY = import.meta.env.VITE_DATA_LOADED_DELAY;

export const NAVIGATION = {
	LOGIN: '/login',
	HOME: '/',
	COLLECTIONS: '/collections',
	PRODUCT: '/products',
	PRODUCT_GROUP: '/product-groups',
	COUPONS: '/coupons',
	ORDERS: '/orders',
	USERS: '/users',
	ABANDONED_CARTS: '/abandoned-carts',
};

export enum TRANSACTION_STATUS {
	CODE = 'CODE',
	CHECKING_COUPON = 'CHECKING_COUPON',
	COUPON_VALID = 'COUPON_VALID',
	COUPON_ERROR = 'COUPON_ERROR',
	TRANSACTION_ID = 'TRANSACTION_ID',
	GROSS_AMOUNT = 'GROSS_AMOUNT',
	TAX = 'TAX',
	DISCOUNT = 'DISCOUNT',
	TOTAL_AMOUNT = 'TOTAL_AMOUNT',
	TRANSACTION_ERROR = 'TRANSACTION_ERROR',
}

export const COUNTRIES: {
	[country_code: string]: string;
} = countries;
