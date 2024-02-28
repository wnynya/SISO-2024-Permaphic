import { registerFont, createCanvas } from 'canvas';

class Permage {
  constructor() {
    this.id = Date.now().toString(36);

    this.width = 2000;
    this.height = 2800;
    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext('2d');

    this.rect(0, 0, this.width, this.height, 'white');
  }

  rect(x1, y1, x2, y2, fill = 'black') {
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  }

  dot(x, y, size = 1, fill = 'black') {
    this.ctx.fillStyle = fill;
    const wx = this.width / 2 + x;
    const hy = this.height / 2 + y;
    const s = size / 2;
    this.rect(wx - s, hy - s, wx + s, hy + s, fill);
  }

  draw(t) {
    let theme = t === undefined ? Math.floor(Math.random() * 3) : t;
    console.log(`theme: ${theme}`);
    for (let t = 0; t < 2 * Math.PI; t += 0.00005) {
      let x1 = 4.5 * Math.sin(8 * t) * Math.cos(t * 17);
      let y1 = 4.5 * Math.sin(8 * t) * Math.sin(t * 17);
      let l = (2 * Math.PI) / 2;
      let r = 0;
      let g = 0;
      let b = 0;
      if (theme == 0) {
        if (t < l * 1) {
          r = 255;
          g = 220 - Math.floor(220 * (t / l));
          b = 0;
        } else {
          r = 255 - Math.floor(32 * (t / l));
          g = 0;
          b = Math.floor(255 * (t / l));
        }
      } else if (theme == 1) {
        if (t < l * 1) {
          g = 255;
          b = 220 - Math.floor(220 * (t / l));
          r = 0;
        } else {
          g = 255 - Math.floor(32 * (t / l));
          b = 0;
          r = Math.floor(255 * (t / l));
        }
      } else if (theme == 2) {
        if (t < l * 1) {
          b = 255;
          g = 220 - Math.floor(220 * (t / l));
          r = 0;
        } else {
          b = 255 - Math.floor(32 * (t / l));
          g = 0;
          r = Math.floor(255 * (t / l));
        }
      }
      this.dot(x1 * 200, y1 * 200 - 100, 1, `rgb(${r},${g},${b})`);
    }
  }

  toPNG() {
    return this.canvas.toBuffer('image/png');
  }

  toPDF() {
    const canvas = createCanvas(this.width, this.height, 'pdf');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.canvas, 0, 0, this.width, this.height);
    return canvas.toBuffer('application/pdf');
  }
}

export default Permage;
