import express from 'express';

const router = express.Router();

router.get('/', (_, res) => res.redirect('/home'));

export default router;
