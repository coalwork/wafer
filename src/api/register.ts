import { default as express, RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import User from '../schemas/User';
import validator from './user-validator';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { error: invalid } = validator(req.body);

  if (invalid) 
    return res.json({
      errors: invalid.details.map(detail => detail.message)
    });

  try {
    await User.create({
      name: req.body.username,

    });
  } catch(error) {
    if (error) return res.status(500).end();
  }

  res.end();
});

export default router;
