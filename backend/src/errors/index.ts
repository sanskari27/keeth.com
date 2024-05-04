import CustomError from './CustomError';
import USER_ERRORS from './auth-errors';
import COMMON_ERRORS from './common-errors';
import ORDER_ERRORS from './order-errors';
import PAYMENT_ERROR from './payment-error';

export default CustomError;

const ERRORS = {
	USER_ERRORS: USER_ERRORS,
	COMMON_ERRORS: COMMON_ERRORS,
	PAYMENT_ERRORS: PAYMENT_ERROR,
	ORDER_ERRORS: ORDER_ERRORS,
};

export { COMMON_ERRORS, ERRORS, ORDER_ERRORS, PAYMENT_ERROR, USER_ERRORS };
