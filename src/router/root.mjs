import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('root.html');
});

router.get('/dev/v2', (req, res) => {
  res.render('dev/permage-v2.html');
});

export default router;
