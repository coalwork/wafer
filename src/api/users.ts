import express from 'express';

import User from '../schemas/User';

const router = express.Router();

const disallowedProperties = [
  'email',
  'hash'
];

function sanitizeUser(user: any) {
  const tempUser = { ...user };

  for (let property in tempUser) {
    if (!disallowedProperties.includes(property)) continue;
    delete tempUser[property];
  }

  return tempUser;
}

router.get('/users', async (_, res) => {
  let users: any;
  let tempUsers = [];

  try {
    users = await User.find({}).lean();
  } catch(error) {
    console.error(error);
    return res.status(500).end();
  }

  for (let user of users) {
    tempUsers.push(sanitizeUser(user));
  }

  res.json(tempUsers);
});

router.get('/users/:name', async (req, res) => {
  const { name } = req.params;
  let user;
  
  try {
    user = await User.findOne({ name }).lean();
  } catch(error) {
    console.error(error);
    return res.status(500).end();
  }

  if (!user) return res.status(404).end();
  res.json(sanitizeUser(user));
});

router.delete('/users/:name', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end();

  const { name } = <any> req?.user;

  if (req.params.name !== name) return res.status(403).end();
  
  try {
    await User.deleteOne({ name });
  } catch(error) {
    console.error(error);
    return res.status(500).end();
  }

  res.end();
});

export default router;
