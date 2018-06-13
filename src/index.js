import 'babel-polyfill';
// import 'babel-core/register';
import mongoose from 'mongoose';
import Promise from 'bluebird';

import app from './config/express';
import { dbConfig, appConfig } from './config/vars';

mongoose.Promise = Promise;
const {
  port, path, host, basePort, basePath,
} = appConfig;

function listen() {
  app.listen(port);
  console.log(`💻  API started on port ${port}`);
  console.log(`📔  Swagger on ${host}:${basePort}${basePath}${path}/docs`);
}

function connect() {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1,
      },
    },
  };
  console.log('MONGO URL =>', dbConfig.db);
  return mongoose.connect(dbConfig.db, options).connection;
}

connect()
  .on('error', () => {
    console.log('MONGO URL =>', dbConfig.db);
    throw new Error(`unable to connect to database: ${dbConfig.db}`);
  })
  .on('disconnected', connect)
  .once('open', listen);

export default app;
