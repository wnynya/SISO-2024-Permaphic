'use strict';

class Permaphic {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  rect(x1, y1, x2, y2, fill = 'black') {
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  }

  dot(x, y, size = 1, fill = 'black', noise = 0) {
    this.ctx.fillStyle = fill;
    let wx = this.canvas.width / 2 + x;
    let hy = this.canvas.height / 2 + y;
    wx += Math.random() * noise - noise / 2;
    hy += Math.random() * noise - noise / 2;
    const s = size / 2;
    this.rect(wx - s, hy - s, wx + s, hy + s, fill);
  }

  image(image, x1, y1, x2, y2, fit = 'none') {
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
  }

  text(content, font, fill = 'black', x1, y1) {}
}
