import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
import { createJwt, verifyJwt } from '../helpers/jwt';
import User from '../models/user';

const UserController = {
  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *      - User
   *     description: Show all users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: limit
   *         description: pagination limit.
   *         in: query
   *         required: false
   *         type: string
   *       - name: offset
   *         description: pagination offset.
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: return an array of users'
   */

  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };

    User.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(users => res.json(users))
    .catch(next);
  },

  /**
   * @swagger
   * /users:
   *   post:
   *     tags:
   *      - User
   *     description: Create users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: firstName
   *         description: User's first name.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: User object'
   */

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

  /**
   * @swagger
   * /users/login:
   *   post:
   *     tags:
   *      - User
   *     description: Login to the application
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: returns user token'
   */

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
      .catch(err => next(err));
  },

  /**
   * @swagger
   * /users/me:
   *   get:
   *     tags:
   *      - User
   *     description: user info
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: User's first name.
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user information'
   */

  readByMe(req, res, next) {
    return res.json(res.locals.user);
  },

};

export default UserController;
