import httpStatus from 'http-status';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
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

export const readAll = async (req, res) => {
  const offset = paginate.offset(req.query.offset);
  const limit = paginate.limit(req.query.limit);

  const find = req.query.find || {};
  const sort = req.query.sort || {
    createdAt: 1,
  };

  const posts = await Post.paginate(find, {
    sort,
    offset,
    limit,
  });
  res.json(posts);
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

export const create = async (req, res) => {
  const user = await User.findById(req.body.author);
  if (!user) throw new APIError('user not found.', httpStatus.NOT_FOUND);
  const post = await Post.create(req.body);
  res.json(post);
};
