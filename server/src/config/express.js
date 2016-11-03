import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import nodemailer from 'nodemailer';
import { appConfig, mailer } from './index';
import routes from '../routes';

const app = express();

app.disable('x-powered-by');
app.use(methodOverride('X-HTTP-Method-Override'));

if (appConfig.env === 'development' || appConfig.env === 'testing') {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
}

app.use(bodyParser.json());
app.use(cors());
// future add swagger and api error
app.use(appConfig.path, routes);
app.locals.config = appConfig;
app.locals.transport = nodemailer.createTransport(mailer);
export default app;
