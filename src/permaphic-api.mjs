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

class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.#updateWidth();
  }

  #updateWidth() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  fit(multiply = 1) {
    this.canvas.width = this.canvas.offsetWidth * multiply;
    this.canvas.height = this.canvas.offsetHeight * multiply;
    this.#updateWidth();
    return this;
  }

  rect(x1, y1, x2, y2, fill = 'black') {
    if (fill == 'clear') {
      this.ctx.clearRect(x1, y1, x2 - x1, y2 - y1);
    } else {
      this.ctx.fillStyle = fill;
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }
    return this;
  }

  dot(x, y, size = 1, fill = 'black', noise = 0) {
    this.ctx.fillStyle = fill;
    let wx = this.canvas.width / 2 + x;
    let hy = this.canvas.height / 2 + y;
    wx += Math.random() * noise - noise / 2;
    hy += Math.random() * noise - noise / 2;
    const s = size / 2;
    this.rect(wx - s, hy - s, wx + s, hy + s, fill);
    return this;
  }

  image(image, x1, y1, x2, y2, fit = 'none') {
    if (image instanceof Canvas) {
      image = image.canvas;
    }

    let dw = x2 - x1;
    let dh = y2 - y1;
    let iw = image.width;
    let ih = image.height;
    let dr = dw / dh;
    let ir = iw / ih;

    let dx1 = x1;
    let dx2 = x2;
    let dy1 = y1;
    let dy2 = y2;

    let ix1 = 0;
    let iy1 = 0;
    let ix2 = iw;
    let iy2 = ih;

    switch (fit) {
      case 'fill': {
        this.ctx.drawImage(image, ix1, iy1, ix2, iy2, dx1, dy1, dx2, dy2);
        break;
      }
      case 'contain': {
        if (dr < ir) {
          let o = dh - (dr / ir) * dh;
          dy1 += o / 2;
          dy2 -= o;
        } else {
          let o = dw - (ir / dr) * dw;
          dx1 += o / 2;
          dx2 -= o;
        }
        this.ctx.drawImage(image, ix1, iy1, ix2, iy2, dx1, dy1, dx2, dy2);
        break;
      }
      case 'cover': {
        if (dr < ir) {
          let o = iw - (dr / ir) * iw;
          ix1 = o / 2;
          ix2 = iw - o;
        } else {
          let o = ih - (ir / dr) * ih;
          iy1 = o / 2;
          iy2 = ih - o;
        }
        this.ctx.drawImage(image, ix1, iy1, ix2, iy2, dx1, dy1, dx2, dy2);
        break;
      }
    }

    return this;
  }

  text(content, font, fill = 'black', x1, y1) {
    return this;
  }

  fill(fill = 'white') {
    if (typeof fill === 'string') {
      this.rect(0, 0, this.canvas.width, this.canvas.height, fill);
    } else {
      this.image(fill, 0, 0, this.canvas.width, this.canvas.height, 'cover');
    }
  }

  clear() {
    this.fill('clear');
  }

  mix(value = 'none') {
    this.ctx.globalCompositeOperation = value;
    return this;
  }

  filter(value = 'none') {
    this.ctx.filter = value;
    return this;
  }
}

async function print(data) {
  const imgBuffer = Buffer.from(data.split(',')[1], 'base64');
  const image = new Image();
  image.src = imgBuffer;

  const pdfc = createCanvas(1000, 1500, 'pdf');
  const pdfv = new Canvas(pdfc);
  pdfv.image(image, 0, 0, 1000, 1500, 'cover');
  //const pdfx = pdfc.getContext('2d');
  //pdfx.drawImage(image, 0, 0, 1000, 1450);
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
