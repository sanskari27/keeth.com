import { ServerError } from '../types';

const ORDER_ERRORS = {
	ORDER_NOT_CANCELLED: {
		STATUS: 400,
		TITLE: 'ORDER_NOT_CANCELLED',
		MESSAGE: 'Cannot cancel order after order being shipped.',
	},
	RETURN_FAILED: {
		STATUS: 400,
		TITLE: 'RETURN_FAILED',
		MESSAGE: 'This item cannot be returned.',
	},
} satisfies {
	[error: string]: ServerError;
};

export default ORDER_ERRORS;
