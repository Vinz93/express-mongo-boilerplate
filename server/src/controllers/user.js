import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
import { createJwt, verifyJwt } from '../services/jwt';
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

  async readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };

    const users = await User.paginate(find, {
      sort,
      offset,
      limit,
    });
    res.json(users);
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
   *       - name: user
   *         description: User object.
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/User'
   *              - properties:
   *                  id:
   *                    type: string
   *                  createdAt:
   *                    type: string
   *                    format: date-time
   *                  updatedAt:
   *                    type: string
   *                    format: date-time
   */
  async create(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const newUser = await User.create(req.body);
      return res.json(newUser);
    }
    return next(new APIError('The user already exist.', httpStatus.UNPROCESSABLE_ENTITY));
  },

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *      - User
   *     description: updates an user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: User id
   *         in: path
   *         required: true
   *         type: string
   *       - name: user
   *         description: User object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: User object'
   */

  async update(req, res, next) {
    const user = await User.findById(req.params.id);
    if (!user) next(new APIError('User not found.', httpStatus.NOT_FOUND));
    user.set(req.body);
    user.save()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
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

  async login(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new APIError('user not found', httpStatus.NOT_FOUND));
    if (!user.authenticate(req.body.password)) {
      return next(new APIError('wrong password', httpStatus.BAD_REQUEST));
    }
    return res.json({
      token: createJwt(user),
    });
  },

  async validate(req, res, next) {
    const token = req.get('Authorization');
    const { id } = await verifyJwt(token);
    const user = await User.findById(id);
    if (!user) return next(new APIError('User not found', httpStatus.UNAUTHORIZED));
    res.locals.user = user;
    next();
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
