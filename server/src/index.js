import mongoose from 'mongoose';
import Promise from 'bluebird';

import app from './config/express';
import config from './config/env';

import 'babel-core/register';
import 'babel-polyfill';

mongoose.Promise = Promise;
const { port, path, host } = config.appConfig;

function listen() {
  app.listen(port);
  console.log(`💻  API started on port ${port}`);
  console.log(`📔  Swagger on ${host}:${port}${path}docs`);
}

function connect() {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1,
      },
    },
  };
  return mongoose.connect(config.dbConfig.db, options).connection;
}

connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', listen);

export default app;
