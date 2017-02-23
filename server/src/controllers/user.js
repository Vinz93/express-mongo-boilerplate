import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
import { createJwt, verifyJwt } from '../helpers/jwt';
import User from '../models/user';

const UserController = {

  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };
    const select = {
      password: 0,
    };

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
        return Promise.reject(new APIError('The user already exist.', httpStatus.UNPROCESSABLE_ENTITY));
      }
    })
    .catch(next);
  },

  login(req, res, next) {
    User.findOne({
      email: req.body.email,
    })
    .then(user => {
      if (!user) {
        return Promise.reject(new APIError('user not found', httpStatus.NOT_FOUND));
      }
      if (!user.authenticate(req.body.password)) {
        return Promise.reject(new APIError('wrong password', httpStatus.BAD_REQUEST));
      }
      return res.json({
        token: createJwt(user),
      });
    })
    .catch(err => next(err));
  },

  validate(req, res, next) {
    const token = req.get('Authorization');
    verifyJwt(token)
      .then(({ id }) => {
        console.log('pas thorung ');
        User.findById(id)
          .then(user => {
            if (!user) {
              return Promise.reject(new APIError('User not found', httpStatus.UNAUTHORIZED));
            }
            res.locals.user = user;
            next();
          })
          .catch(next);
      })
      .catch(err => {
        console.log('handle errors');
        next(err);
      });
  },

  readByMe(req, res, next) {
    return res.json(req.locals.user);
  },

};

export default UserController;
