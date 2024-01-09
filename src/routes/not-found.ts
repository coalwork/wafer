import express from 'express';
import { compileFile } from '../utils';
import { render, toRenderOptions } from './handlebars';

const router = express.Router();

router.use((_, res) => res.send(render('.not-found', toRenderOptions(res.locals))));

export default router;
