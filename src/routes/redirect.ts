import express from 'express';

const router = express.Router();

router.get('/', (_, res) => res.redirect('/home'));

router.get('/scripts/socket.io.js', (_, res) => res.redirect('/socket.io/socket.io.js'));

export default router;
