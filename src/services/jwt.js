import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import { APIError } from '../helpers/errors';
import { appConfig } from '../config/vars';

export const createJwt = user => (
  jwt.sign({
    id: user._id,
    date: Date.now(),
  }, appConfig.passportSecret)
);


export const verifyJwt = token => (
  new Promise((resolve, reject) => {
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        reject(new APIError('Invalid token.', httpStatus.UNAUTHORIZED));
      } else {
        resolve(decoded);
      }
    });
  })
);
