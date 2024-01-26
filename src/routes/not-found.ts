import express from 'express';
import { render, toRenderOptions } from './handlebars';

const router = express.Router();

router.use((req, res) => {
  res.locals.headContext.title = 'not found';
  res.status(404).send(render('.not-found', toRenderOptions(res.locals)));
});

export default router;
