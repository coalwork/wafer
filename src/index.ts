import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Server } from 'socket.io';

import './mongoose';

import { default as registerRouter } from './api/register';
import { default as loginRouter } from './api/login';
import { default as logoutRouter } from './api/logout';
import { default as usersAPIRouter } from './api/users';

import { default as sessionRouter } from './routes/session';
import { default as redirectRouter } from './routes/redirect';
import { default as handlebarsRouter } from './routes/handlebars';
import { default as errorRouter } from './routes/error';
import { default as usersRouter } from './routes/users';
import { default as protectedRouter } from './routes/protected';

import { toRenderOptions } from './routes/handlebars'

const app = express();

app.use(
  morgan('dev'),
  sessionRouter,
  passport.initialize(),
  passport.session(),
  compression(),
  express.static('src/public')
);

// api
app.use(
  '/api',
  bodyParser.urlencoded({ extended: true }),
  registerRouter,
  loginRouter,
  logoutRouter,
  usersAPIRouter
);

// routes
app.use(
  (req, res, next) => {
    res.locals = toRenderOptions(res.locals);
    res.locals.templateContext.authenticated = req.isAuthenticated();
    res.locals.templateContext.user = req.user;
    res.locals.error = {};
    next();
  },
  protectedRouter,
  redirectRouter,
  usersRouter,
  handlebarsRouter,
  errorRouter
);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

const io = new Server(server, {
  serveClient: false
});

io.on('connection', socket => {
});
