import express from 'express';
import { VerifyAccount } from '../../middleware';
import Controller from './session.controller';
import { LoginAccountValidator } from './session.validator';

const router = express.Router();

router.route('/validate-auth').all(VerifyAccount).post(Controller.validateAuth);
router.route('/login').all(LoginAccountValidator).post(Controller.login);
router.route('/register').all(LoginAccountValidator).post(Controller.register);

router.route('/create-session').post(Controller.createSession);

export default router;
