import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compress from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import passport from 'passport';
import swaggerDoc from 'swagger-jsdoc';
import swaggerTools from 'swagger-tools';

import errorMessages from '../services/middlewares/error_messages';
import errorResponse from '../services/middlewares/error_response';
import routes from '../routes';
import { appConfig } from './vars';

const app = express();
const spec = swaggerDoc({
  swaggerDefinition: {
    info: {
      title: 'API',
      version: '1.0.0',
    },
    basePath: `${appConfig.basePath}${appConfig.path}`,
  },
  apis: [
    `${path.resolve()}/src/models/**/*.js`,
    `${path.resolve()}/src/controllers/**/*.js`,
    `${path.resolve()}/src/routes/**/*.js`,
  ],
});

app.use(compress());
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(methodOverride('X-HTTP-Method-Override'));

if (appConfig.env === 'development') {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
}

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use(`${appConfig.basePath}${appConfig.path}`, routes);

swaggerTools.initializeMiddleware(spec, (middleware) => {
  app.use(middleware.swaggerUi({
    apiDocs: `${appConfig.basePath}${appConfig.path}/docs.json`,
    swaggerUi: `${appConfig.basePath}${appConfig.path}/docs`,
    apiDocsPrefix: `${appConfig.basePath}${appConfig.path}`,
    swaggerUiPrefix: '/',
  }));
});

app.use(errorMessages);
app.use(errorResponse);

app.locals.config = appConfig;

export default app;
