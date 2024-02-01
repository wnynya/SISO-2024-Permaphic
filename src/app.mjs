'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { exec } from 'node:child_process';

import Permage from './permange.mjs';

async function print(file) {
  await (() => {
    return new Promise((resolve, reject) => {
      let options = `SumatraPDF-3.5.2-64.exe `;
      options += `-print-to "EPSON PM-400 Series" `;
      options += `-print-settings "shrink,color,paper=10 x 15 cm (4 x 6 in)" `;
      options += `"${file}"`;

      console.log(options);
      const process = exec(options, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        console.log(stdout);
      });
      process.on('close', resolve);
    });
  })();
}

let t = 0;
async function task() {
  const pmg = new Permage();

  pmg.draw(t);
  t++;
  t = t > 2 ? 0 : t;

  const latestPNG = path.resolve(__dirname, `../data/latest.png`);
  fs.writeFileSync(latestPNG, pmg.toPNG());

  const PDFFile = path.resolve(__dirname, `../data/${pmg.id}.pdf`);
  fs.writeFileSync(PDFFile, pmg.toPDF());
  await print(PDFFile);
  fs.unlinkSync(PDFFile);
}

import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './test.html'));
});

app.get('/test', async (req, res) => {
  await task();
  res.status(200).end();
});

app.listen(39080);
