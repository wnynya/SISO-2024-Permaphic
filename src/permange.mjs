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

  draw() {
    this.draw2();
  }

  draw1() {
    for (let t = 0; t < 2 * Math.PI; t += 0.00005) {
      let x = 4.5 * Math.sin(8 * t) * Math.cos(t * 17);
      let y = 4.5 * Math.sin(8 * t) * Math.sin(t * 17);
      this.dot(x * 200, y * 200 - 100, 1);
    }
  }

  draw2() {
    for (let t = 0; t < 2 * Math.PI; t += 0.00005) {
      let x = Math.sin(t * 6.0);
      let y = Math.cos(t * 3) * Math.tan(t * 2);
      this.dot(x * 500, y * 500, 1, `blue`);
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
