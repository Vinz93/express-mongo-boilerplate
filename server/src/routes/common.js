import express from 'express';
import validate from 'express-validation';

import User from '../controllers/user';
import userValidator from '../services/param_validations/user';
import * as Post from '../controllers/post';
import postValidator from '../services/param_validations/post';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/users')
  .get(validate(userValidator.readAll), User.readAll)
  .post(validate(userValidator.create), User.create);

router.route('/users/:id')
  .put(validate(userValidator.update), User.update);

router.route('/users/login')
  .post(validate(userValidator.login), User.login);

router.route('/users/me')
  .get(validate(userValidator.readByMe), User.validate, User.readByMe);

router.route('/posts')
  .get(validate(postValidator.readAll), Post.readAll);

export default router;
