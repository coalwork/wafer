import express from 'express';

const router = express.Router();

router.get('/chat', (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.locals.templateContext.username = (<any> req.user).name;
  next();
});

export default router;
