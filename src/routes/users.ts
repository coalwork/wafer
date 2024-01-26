import express from 'express';

import User from '../schemas/User';
import { render, toRenderOptions } from '../routes/handlebars';

const router = express.Router();

router.get('/users', async (_, res, next) => {
  const users = User.find({});

  let normalAndLean;
  try {
    normalAndLean = await Promise.all([
      users.exec(), users.lean().clone().exec()
    ]);
  } catch(error) {
    console.error(error);
    return res.status(500).end();
  }

  res.locals.templateContext.usersFull = normalAndLean[0];
  res.locals.templateContext.users = normalAndLean[1];

  next();
});

router.get('/self', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401);
    return next();
  }

  res.redirect(`/users/${(<any> req.user).name}`);
});

router.get('/users/:name', async (req, res, next) => {
  const user = await User.findOne({ name: req.params.name }).lean();

  if (!user) return next();

  res.locals.headContext.title = req.params.name;
  res.locals.styles.push('user');
  res.locals.scripts.push('user');
  res.locals.templateContext.requestedUser = user;

  res.send(render('.user', toRenderOptions(res.locals)));
});

export default router;
