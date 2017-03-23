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
      title: Joi.string().required(),
      content: Joi.string().required(),
      image: Joi.string(),
      categories: Joi.array().items(Joi.string()),
      author: Joi.objectId().required(),
    },
  },
};
