import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import nodemailer from 'nodemailer';

import errorMessages from '../services/middlewares/error_messages';
import errorResponse from '../services/middlewares/error_response';
import config from './env';
import routes from '../routes';

const app = express();

app.disable('x-powered-by');
app.use(methodOverride('X-HTTP-Method-Override'));

if (config.appConfig.env === 'development' || config.appConfig.env === 'testing') {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
}

app.use(bodyParser.json());
app.use(cors());
// future add swagger
app.use(config.appConfig.path, routes);

app.use(errorMessages);

app.use(errorResponse);

app.locals.config = config.appConfig;
app.locals.transport = nodemailer.createTransport(config.mailer);
export default app;
