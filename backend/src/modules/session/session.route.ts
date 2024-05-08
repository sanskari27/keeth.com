import express from 'express';
import { VerifyAccount } from '../../middleware';
import { VerifyAdmin } from '../../middleware/VerifySession';
import Controller from './session.controller';
import {
	GoogleLoginValidator,
	LoginAccountValidator,
	ResetPasswordValidator,
	UpdatePasswordValidator,
} from './session.validator';

const router = express.Router();

router.route('/validate-auth/admin').all(VerifyAdmin).get(Controller.validateAuth);
router.route('/validate-auth').all(VerifyAccount).get(Controller.validateAuth);
router.route('/login').all(LoginAccountValidator).post(Controller.login);
router.route('/reset-password').all(ResetPasswordValidator).post(Controller.resetPassword);
router.route('/update-password').all(UpdatePasswordValidator).post(Controller.updatePassword);
router.route('/logout').post(Controller.logout);
router.route('/google-login').all(GoogleLoginValidator).post(Controller.googleLogin);
router.route('/register').all(LoginAccountValidator).post(Controller.register);
router.route('/users').all(VerifyAdmin).get(Controller.listUsers);

router.route('/create-session').post(Controller.createSession);

export default router;
