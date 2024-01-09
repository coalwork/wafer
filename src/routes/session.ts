import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';

const router = express.Router();
const { connection } = mongoose;

router.use(session({
  cookie: {
    maxAge: 604800000
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET,
  store: MongoStore.create({
    dbName: process.env.MONGODBNAME,
    clientPromise: connection.asPromise().then(() => connection.getClient())
  })
}));

export default router;
