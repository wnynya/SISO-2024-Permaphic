const canvas = document.querySelector('#paper');
canvas.width = 1000;
canvas.height = 1500;
const ctx = canvas.getContext('2d');

function rect(x1, y1, x2, y2, fill = 'black') {
  ctx.fillStyle = fill;
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}

function dot(x, y, size = 1, fill = 'black', noise = 0) {
  ctx.fillStyle = fill;
  let wx = canvas.width / 2 + x;
  let hy = canvas.height / 2 + y;
  wx += Math.random() * noise - noise / 2;
  hy += Math.random() * noise - noise / 2;
  const s = size / 2;
  rect(wx - s, hy - s, wx + s, hy + s, fill);
}

let v = {
  m: 500,
  n: 0,
  a: 0,
  b: 0,
  c: 0,
  d: 0,
};

function values() {
  v.theme = document.querySelector('input[name="theme"]:checked').value * 1;
  v.mode = document.querySelector('input[name="mode"]:checked').value * 1;
  v.m = document.querySelector(`input[name="line-m"]`).value;
  v.n = document.querySelector(`input[name="line-n"]`).value;
  v.a = document.querySelector(`input[name="line-range-a"]`).value;
  v.b = document.querySelector(`input[name="line-range-b"]`).value;
  v.c = document.querySelector(`input[name="line-range-c"]`).value;
  v.d = document.querySelector(`input[name="line-range-d"]`).value;
}

function draw1() {
  for (let t = 0; t < 2 * Math.PI; t += 0.0001) {
    let x = Math.sin(t * v.a) * Math.cos(t * v.b);
    let y = Math.sin(t * v.c) * Math.sin(t * v.d);
    dot(x * v.m, y * v.m, 1, color(t), v.n);
  }
}

function draw2() {
  for (let t = 0; t < 2 * Math.PI; t += 0.0001) {
    let x = Math.sin(t * v.a);
    let y = Math.cos(t * v.b) * Math.tan(t * v.c);
    dot(x * v.m, y * v.m, 1, color(t), v.n);
  }
}

function draw3() {
  for (let t = 0; t < 2 * Math.PI; t += 0.0001) {
    let x = Math.cos(t * v.a);
    let y = Math.tan(t * v.b) * Math.tan(t * v.c);
    dot(x * v.m, y * v.m, 1, color(t), v.n);
  }
}

function color(t) {
  let l = Math.PI;
  let r = 0;
  let g = 0;
  let b = 255;
  if (v.theme == 1) {
    if (t < l * 1) {
      r = 255;
      g = 220 - Math.floor(220 * (t / l));
      b = 0;
    } else {
      r = 255 - Math.floor(32 * (t / l));
      g = 0;
      b = Math.floor(255 * (t / l));
    }
  } else if (v.theme == 2) {
    if (t < l * 1) {
      g = 255;
      b = 220 - Math.floor(220 * (t / l));
      r = 0;
    } else {
      g = 255 - Math.floor(32 * (t / l));
      b = 0;
      r = Math.floor(255 * (t / l));
    }
  } else if (v.theme == 3) {
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
  return `rgb(${r},${g},${b})`;
}

function draw() {
  rect(0, 0, canvas.width, canvas.height, 'white');
  values();
  if (v.mode == 1) {
    draw1();
  } else if (v.mode == 2) {
    draw2();
  } else if (v.mode == 3) {
    draw3();
  }
}

setInterval(() => {
  draw();
}, 200);
