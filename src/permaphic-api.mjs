'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { exec } from 'node:child_process';

import { registerFont, createCanvas, Image } from 'canvas';

function images() {
  return fs.readdirSync(path.resolve(__dirname, './public/resources/images'));
}

async function print(data) {
  const imgBuffer = Buffer.from(data.split(',')[1], 'base64');
  const image = new Image();
  image.src = imgBuffer;

  const pdfc = createCanvas(1000, 1500, 'pdf');
  const pdfx = pdfc.getContext('2d');
  pdfx.drawImage(image, 0, 0, 1000, 1500);
  const file = path.resolve(__dirname, '../latest.pdf');
  const pdfBuffer = pdfc.toBuffer('application/pdf');
  fs.writeFileSync(file, pdfBuffer);

  await (() => {
    return new Promise((resolve, reject) => {
      let options = `SumatraPDF-3.5.2-64.exe `;
      options += `-print-to "EPSON PM-400 Series" `;
      options += `-print-settings "shrink,color,paper=10 x 15 cm (4 x 6 in)" `;
      //options += `-silent `;
      options += `"${file}"`;

      const process = exec(options, (error, stdout, stderr) => {
        let lines = stdout.split('\n');
        let errorMessage;
        for (let line of lines) {
          console.log(`> ${line}`);
          if (line.match(/Printing problem\.: (.*)/)) {
            errorMessage = line.replace(/Printing problem\.: (.*)/, '$1');
          }
        }
        if (error) {
          console.log('[ERROR]: ', error);
        }
        if (errorMessage) {
          console.log('[ERROR]: ', errorMessage);
        }
      });
      process.on('close', () => {
        resolve();
      });
    });
  })();
}

export default {
  print: print,
  images: images,
};
