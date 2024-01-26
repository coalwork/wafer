import express from 'express';

const router = express.Router();

router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end();

  req.logout(error => {
    if (error) {
      console.error(error);
      return res.status(500).end();
    }
    res.status(204).end();
  });
});

export default router;
