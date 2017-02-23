import express from 'express';
import validate from 'express-validation';

import User from '../controllers/user';
import userValidator from '../services/param_validations/user';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/users')
  .get(validate(userValidator.readAll), User.readAll)
  .post(validate(userValidator.create), User.create);

router.route('/users/login')
  .post(validate(userValidator.login), User.login);

router.route('/users/me')
  .get(validate(userValidator.readByMe), User.validate, User.readByMe);

export default router;
