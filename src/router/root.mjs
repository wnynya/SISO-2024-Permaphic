'use strict';

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('root.html');
});

router.get('/dev', (req, res) => {
  res.render('dev.html');
});

import api from '../permaphic-api.mjs';

router.get('/api/images', (req, res) => {
  res.send(api.images());
});

router.post('/api/print', (req, res) => {
  api.print(req).then(() => {
    res.send('ok');
  });
});

export default router;
