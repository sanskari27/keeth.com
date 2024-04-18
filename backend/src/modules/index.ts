import express from 'express';
import CartRoute from './cart/cart.route';
import CollectionRoute from './collection/collection.route';
import ProductRoute from './product/product.route';
import SessionRoute from './session/session.route';
import WishlistRoute from './wishlist/wishlist.route';

import CustomError, { COMMON_ERRORS } from '../errors';
import { Respond } from '../utils/ExpressUtils';
import { FileUpload, ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../utils/files';
import WebhooksRoute from './webhooks/webhooks.route';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/webhooks', WebhooksRoute);

router.use('/cart', CartRoute);
router.use('/wishlist', WishlistRoute);
router.use('/sessions', SessionRoute);
router.use('/collections', CollectionRoute);
router.use('/products', ProductRoute);

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

export default router;
