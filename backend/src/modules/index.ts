import express from 'express';
import CartRoute from './cart/cart.route';
import CheckoutRoute from './checkout/checkout.route';
import CollectionRoute from './collection/collection.route';
import CouponRoute from './coupon/coupon.route';
import ProductGroupRoute from './product-group/product-group.route';
import ProductRoute from './product/product.route';
import SessionRoute from './session/session.route';
import WishlistRoute from './wishlist/wishlist.route';

import { RESEND_FEEDBACK_EMAIL } from '../config/const';
import CustomError, { COMMON_ERRORS } from '../errors';
import PhonePeProvider from '../provider/phonepe';
import { Respond } from '../utils/ExpressUtils';
import { sendSimpleText } from '../utils/email';
import { FileUpload, ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../utils/files';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/cart', CartRoute);
router.use('/checkout', CheckoutRoute);
router.use('/collections', CollectionRoute);
router.use('/coupon', CouponRoute);
router.use('/product-group', ProductGroupRoute);
router.use('/products', ProductRoute);
router.use('/sessions', SessionRoute);
router.use('/wishlist', WishlistRoute);

router.use('/phonepe/callback', PhonePeProvider.Callbacks.transactionCallback);

router.post('/upload-media', async function (req, res, next) {
	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {
			fileFilter: ONLY_MEDIA_ALLOWED,
		},
	};

	try {
		const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		return Respond({
			res,
			status: 200,
			data: {
				name: uploadedFile.filename,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR, err));
	}
});

router.post('/feedback', async function (req, res, next) {
	const data = req.body.data;
	if (!data) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	const success = await sendSimpleText(RESEND_FEEDBACK_EMAIL, data);
	return Respond({
		res,
		status: success ? 200 : 400,
	});
});

export default router;
