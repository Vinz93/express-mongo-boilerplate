import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import httpStatus from 'http-status';

import { APIError } from '../helpers/errors';

export const createJwt = user => (
  jwt.sign({
    id: user._id,
    email: user.email,
    date: Date.now(),
  }, 'secret')
);

export const verifyJwt = token => (
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      console.log('the is error', err);
      return Promise.reject(new APIError('Invalid token.', httpStatus.UNAUTHORIZED));
    }
    console.log(decoded);
    return Promise.resolve(decoded);
  })
);
