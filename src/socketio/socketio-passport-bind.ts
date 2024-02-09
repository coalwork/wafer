import { RequestHandler } from 'express';
import { sessionMiddleware } from '../routes/session';
import passport from 'passport';

function onlyForHandshake(middleware: RequestHandler) {
  const handler: RequestHandler = (req: any, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };

  return handler;
}

const bind = (io: any) => {
  io.engine.use(onlyForHandshake(sessionMiddleware));
  io.engine.use(onlyForHandshake(passport.session()));
  io.engine.use(
    onlyForHandshake((req, res, next) => {
      if (req.isAuthenticated()) return next();
      res.locals.error.code = 401;
      next();
    }),
  );
};

export default bind;
