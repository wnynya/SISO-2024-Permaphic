'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function print() {}

function images() {
  return fs.readdirSync(
    path.resolve(__dirname, './public/resources/permaphic/random-images')
  );
}

export default {
  print: print,
  images: images,
};
