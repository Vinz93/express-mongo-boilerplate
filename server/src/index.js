import mongoose from 'mongoose';
import Promise from 'bluebird';

import app from './config/express';
import config from './config/env';

mongoose.Promise = Promise;

function listen() {
  app.listen(config.appConfig.port);
  console.log(`API started on port ${config.appConfig.port}`);
  console.log(`Swagger on ${config.appConfig.host}:${config.appConfig.port}${config.appConfig.path}docs`);
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
