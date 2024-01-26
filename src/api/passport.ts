import { RequestHandler } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../schemas/User';

passport.use(new LocalStrategy(async (username, password, done) => {
  let user;

  try {
    user = await User.findOne({ name: username }).lean();
  } catch(error) {
    console.error(error);
    return done(error, { message: 'server side error' });
  }

  if (!user) return done(null, false, { message: `could not find user "${username}"` });

  if (!await bcrypt.compare(password, user.hash)) {
    return done(null, false, { message: 'incorrect password' });
  }

  done(null, user);
}));

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user, error;

  try { user = await User.findById(id).lean(); }
  catch(e) { error = e; }

  done(error, user);
});

export const authenticate: RequestHandler = (req, res, next) => {
  const callback: passport.AuthenticateCallback = (error, user, info: any) => {
    const message = info?.message;

    if (error) {
      res.locals.message = message;
      return next(error);
    }
    if (!user) {
      res.locals.message = message;
      return next();
    }

    req.login(user, next);
  };

  passport.authenticate('local', callback)(req, res, next);
}
