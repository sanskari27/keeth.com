import CustomError from './CustomError';
import USER_ERRORS from './auth-errors';
import COMMON_ERRORS from './common-errors';
import PAYMENT_ERROR from './payment-error';

export default CustomError;

const ERRORS = {
	USER_ERRORS: USER_ERRORS,
	COMMON_ERRORS: COMMON_ERRORS,
	PAYMENT_ERRORS: PAYMENT_ERROR,
};

export { COMMON_ERRORS, ERRORS, USER_ERRORS };
