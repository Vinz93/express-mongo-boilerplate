import * as development from './development';
// import production from './production';

const config = {
  development,
}[process.env.NODE_ENV || 'development'];

export default config;
