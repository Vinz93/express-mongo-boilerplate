import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
import { createJwt, verifyJwt } from '../helpers/jwt';
import Post from '../models/post';

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
