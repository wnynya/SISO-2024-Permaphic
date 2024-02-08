'use strict';

import fs from 'node:fs';
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

/* Set static files (src/public) */
app.use(express.static(path.resolve(__dirname, './public')));

export default app;
