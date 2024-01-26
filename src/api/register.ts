import express from 'express';
import bcrypt from 'bcrypt';
import { ValidationError } from 'joi';

import User from '../schemas/User';
import validator from './user-validator';
import { authenticate } from './passport';

const router = express.Router();

router.post('/register', async (req, res) => {
  let username: string;
  let password: string;
  let email: string | undefined;

  try {
    ({ username, password, email } = await validator(req.body));
  } catch(error) {
    if (!(error instanceof ValidationError)) {
      console.error(error);
      return res.status(500).end();
    }
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }

  try {
    await User.create({
      name: username,
      hash: await bcrypt.hash(password, 12),
      email
    });
  } catch(error) {
    console.error(error);
    return res.status(500).end();
  }

  authenticate(req, res, () => res.status(201).end());
});

export default router;
