import express from 'express';
import { getReasonPhrase } from 'http-status-codes';

import { render, toRenderOptions } from './handlebars';

const router = express.Router();

router.use((_, res) => {
  let { error } = res.locals;

  if (!error.hasOwnProperty('code')) {
    error.code = 404;
  }

  error.reason = getReasonPhrase(error.code).toLowerCase();

  res.locals.headContext.title = error.reason;
  res.locals.templateContext.error = error;

  res.status(error.code).send(render('.error', toRenderOptions(res.locals)));
});

export default router;
