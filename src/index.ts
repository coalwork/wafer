import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';

import './mongoose';

import { default as registerRouter } from './api/register';

import { default as sessionRouter } from './routes/session';
import { default as redirectRouter } from './routes/redirect';
import { default as handlebarsRouter } from './routes/handlebars';
import { default as notFoundRouter } from './routes/not-found';

const app = express();

app.use(morgan('dev'));
app.use(compression());
app.use(express.static('src/public'));
app.use('/api', bodyParser.urlencoded({ extended: true }));

// api
app.use('/api', registerRouter);

// routes
app.use(sessionRouter);
app.use(redirectRouter);
app.use(handlebarsRouter);
app.use(notFoundRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
