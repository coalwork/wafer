import { default as express, RequestHandler } from 'express';

import validator from './user-validator';

const router = express.Router();

router.post('/register', (req, res) => {
  const { value, error } = validator(req.body);
  res.end();
});

export default router;
