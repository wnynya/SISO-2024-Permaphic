'use strict';

import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';

const app = express();

/* Body (JSON) parser */
app.use(
  express.urlencoded({
    limit: '8GB',
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(
  express.json({
    limit: '8GB',
  })
);

// 템플릿 엔진 모듈 가져오기
import engine from 'express-template-engine';

// 템플릿 엔진 설정하기
app.engine('html', engine());
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './views'));

/* Set static files (src/public) */
app.use(express.static(path.resolve(__dirname, './public')));

import rootRouter from './router/root.mjs';
app.use(rootRouter);

app.all((req, res) => {
  res.status(404).send('Not Found');
});

export default app;
