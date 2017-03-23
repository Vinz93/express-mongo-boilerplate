import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
import { createJwt, verifyJwt } from '../helpers/jwt';
import Post from '../models/post';
import User from '../models/user';


/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *      - Posts
 *     description: Show all posts
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
 *         description: return an array of posts
 */

export const readAll = (req, res, next) => {
  const offset = paginate.offset(req.query.offset);
  const limit = paginate.limit(req.query.limit);

  const find = req.query.find || {};
  const sort = req.query.sort || {
    createdAt: 1,
  };

  Post.paginate(find, {
    sort,
    offset,
    limit,
  })
  .then(posts => res.json(posts))
  .catch(next);
};

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *      - Posts
 *     description: Create posts
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: post
 *         description: post object.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Post'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Post'
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

export const create = (req, res, next) => {
  User.findById(req.body.author)
    .then(user => {
      if (!user) Promise.reject(new APIError('user not found.', httpStatus.NOT_FOUND));
      return Post.create(req.body);
    })
    .then(post => res.json(post))
    .catch(next);
};
