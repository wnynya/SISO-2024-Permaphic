import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('permaphic.html');
});

router.get('/dev/v2', (req, res) => {
  res.render('dev/permage-v2.html');
});

export default router;
