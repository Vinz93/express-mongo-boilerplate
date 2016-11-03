import mongoose from 'mongoose';
import Promise from 'bluebird';

import app from './config/express';
import { dbConfig, appConfig } from './config';

mongoose.Promise = Promise;

function listen() {
  app.listen(appConfig.port);
  console.log(`API started on port ${appConfig.port}`);
}

function connect() {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1,
      },
    },
  };
  return mongoose.connect(dbConfig.db, options).connection;
}

connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', listen);

export default app;
