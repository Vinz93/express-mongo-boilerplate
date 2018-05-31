import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  readAll: {
    query: {
      offset: Joi.number().integer(),
      limit: Joi.number().integer(),
    },
  },

  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      bornAt: Joi.string().isoDate(),
    },
  },

  update: {
    params: {
      id: Joi.objectId().required(),
    },
    body: {
      email: Joi.string().email(),
      firstName: Joi.string(),
      bornAt: Joi.string(),
    },
  },

  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },

  readByMe: {
    headers: {
      authorization: Joi.string().required(),
    },
  },
};
