import passport from 'passport';
import LocalStrategy from 'passport-local';
import httpStatus from 'http-status';
import moment from 'moment';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/user';
import { APIError } from '../helpers/errors';
import { appConfig, constants } from '../config/vars';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (obj, done) => {
  const user = await User.findById(obj);
  done(null, user);
});

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new APIError('user not found', httpStatus.NOT_FOUND);
    const match = await user.authenticate(password);
    if (!match) {
      throw new APIError('wrong password', httpStatus.BAD_REQUEST);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: appConfig.passportSecret,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const { id, date } = payload;
    const user = await User.findById(id);
    if (!user) return done(null, false);
    const expTime = moment(date).add(constants.tokenExpTime, 'hours');
    if (expTime <= Date.now()) return done(null, false);
    done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
