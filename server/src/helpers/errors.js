import httpStatus from 'http-status';

export class ExtendableError extends Error {
  constructor(message, isPublic) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.isPublic = isPublic;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export class APIError extends ExtendableError {
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = true) {
    super(message, isPublic);

    this.status = status;
  }
}

export class ValidationError extends ExtendableError {
  constructor(message, isPublic = true) {
    super(message, isPublic);
  }

  toAPIError() {
    return new APIError(this.message, httpStatus.BAD_REQUEST, this.isPublic);
  }
}

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

export const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);
