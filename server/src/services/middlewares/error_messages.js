import httpStatus from 'http-status';
import validation from 'express-validation';
import mongoose from 'mongoose';

import { ValidationError, APIError } from '../../helpers/errors';


export default (err, req, res, next) => {
  let message;
  if (err instanceof ValidationError) {
    return next(err.toAPIError());
  } else if (err instanceof mongoose.Error.ValidationError) {
    message = Object.keys(err.errors).map(key => err.errors[key].message).join(' and ');

    return next(new APIError(message, httpStatus.BAD_REQUEST));
  } else if (err instanceof validation.ValidationError) {
    message = err.errors.map(error => error.messages.join('. ')).join(' and ');

    return next(new APIError(message, err.status));
  } else if (!(err instanceof APIError)) {
    return next(new APIError(err.message, err.status, err.isPublic));
  }

  return next(err);
};
