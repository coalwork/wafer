import express from 'express';

import { protect } from '../special-routes';

const router = express.Router();

router.use((req, res, next) => {
  if (!protect.includes(req.path.slice(1))) return next();

  if (!req.isAuthenticated()) {
    res.locals.error = { code: 401 };
  }

  next();
});

export default router;
