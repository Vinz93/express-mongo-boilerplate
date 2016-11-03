import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';
import User from '../models/user';

const UserController = {
  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };
    const select = {};

    User.paginate(find, {
      sort,
      select,
      offset,
      limit,
    })
    .then(users => res.json(users))
    .catch(next);
  },
  create(req, res, next) {
    User.findOne({
      email: req.body.email,
    })
    .then(user => {
      if (!user) {
        User.create(req.body)
          .then(user => res.json(user))
          .catch(next);
      } else {
        return res.json({ err: 'ya existe' });
      }
    })
    .catch(err => res.json({ err }));
  },
};

export default UserController;
