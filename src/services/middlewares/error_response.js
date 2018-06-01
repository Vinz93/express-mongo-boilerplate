import httpStatus from 'http-status';

import { appConfig } from '../../config/vars';

export default (err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: appConfig.env === 'development' ? err.stack : {},
  });
};
