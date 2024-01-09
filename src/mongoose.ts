import 'dotenv/config';
import mongoose from 'mongoose';

const {
  MONGOURI,
  MONGODBNAME,
  MONGOUSER,
  MONGOPASS
} = process.env;

if (!MONGOURI)
  throw Error('uri not given to mongoose');

mongoose.connect(MONGOURI, {
  dbName: MONGODBNAME,
  user: MONGOUSER,
  pass: MONGOPASS
});

mongoose.connection.on(
  'connected',
  () => console.log(`mongoose is connected to ${MONGODBNAME} on ${MONGOURI}`)
);

process.on('exit', () => mongoose.disconnect());
