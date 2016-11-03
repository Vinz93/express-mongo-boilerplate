import express from 'express';

import User from './controllers/user';

const router = express.Router(); // eslint-disable-line new-cap
router.route('/users')
  .get(User.readAll)
  .post(User.create);

export default router;
