import express from 'express';

import { authenticate } from '../api/passport';

const router = express.Router();

router.post('/login', authenticate, (req, res) => {
  if (!req.isAuthenticated()) res.status(401);

  res.json({
    message: res.locals.message
  });
});

export default router;
