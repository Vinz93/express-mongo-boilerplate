import express from 'express';
import validate from 'express-validation';

import User from '../controllers/user';
import userValidator from '../services/param_validations/user';
import * as Post from '../controllers/post';
import postValidator from '../services/param_validations/post';
import { catchErrors } from '../helpers/errors';
const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/users')
  .get(validate(userValidator.readAll), catchErrors(User.readAll))
  .post(validate(userValidator.create), catchErrors(User.create));

router.route('/users/:id')
  .patch(validate(userValidator.update), catchErrors(User.update));

router.route('/users/login')
  .post(validate(userValidator.login), catchErrors(User.login));

router.route('/users/me')
  .get(validate(userValidator.readByMe), catchErrors(User.validate), User.readByMe);

router.route('/posts')
  .get(validate(postValidator.readAll), catchErrors(Post.readAll))
  .post(validate(postValidator.create), catchErrors(Post.create));

export default router;
