import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './coupon.controller';
import { CreateValidator } from './coupon.validator';

const router = express.Router();

router
	.route('/:id')
	.all(VerifySession, IDValidator)
	.put(CreateValidator, Controller.update)
	.delete(Controller.remove);

router
	.route('/')
	.all(VerifySession)
	.get(Controller.listAll)
	.post(CreateValidator, Controller.create);

export default router;
