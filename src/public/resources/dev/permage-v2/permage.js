const canvas = document.querySelector('#paper');
canvas.width = 2000;
canvas.height = 3000;
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
  i1x: 0,
  i1y: 0,
  i2x: 0,
  i2y: 0,
  bla: 0,
  blb: 0,
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
  v.i1x = document.querySelector(`input[name="image1-x"]`).value;
  v.i1y = document.querySelector(`input[name="image1-y"]`).value;
  v.i2x = document.querySelector(`input[name="image2-x"]`).value;
  v.i2y = document.querySelector(`input[name="image2-y"]`).value;
  v.bla = document.querySelector(`input[name="blend-a"]`).value;
  v.blb = document.querySelector(`input[name="blend-b"]`).value;
}

let d = 2;
let dd = 0.00005;

function draw1() {
  for (let t = 0; t < 2 * Math.PI; t += dd) {
    let x = Math.sin(t * v.a) * Math.cos(t * v.b);
    let y = Math.sin(t * v.c) * Math.sin(t * v.d);
    dot(x * v.m, y * v.m, d, color(t), v.n);
  }
}

function draw2() {
  for (let t = 0; t < 2 * Math.PI; t += dd) {
    let x = Math.sin(t * v.a);
    let y = Math.cos(t * v.b) * Math.tan(t * v.c);
    dot(x * v.m, y * v.m, d, color(t), v.n);
  }
}

function draw3() {
  for (let t = 0; t < 2 * Math.PI; t += dd) {
    let x = Math.cos(t * v.a);
    let y = Math.tan(t * v.b) * Math.tan(t * v.c);
    dot(x * v.m, y * v.m, d, color(t), v.n);
  }
}

const image_test1 = document.querySelector('#image-test1');
const image_test2 = document.querySelector('#image-test2');

function drawImage1() {
  ctx.filter = 'opacity(100%) hue-rotate(30deg)';
  ctx.drawImage(image_test1, v.i1x, v.i1y);
  ctx.filter = 'none';
}

function drawImage2() {
  ctx.filter = 'opacity(50%) invert(100%)';
  ctx.drawImage(image_test2, v.i2x, v.i2y);
  ctx.filter = 'none';
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  values();

  //drawImage1();
  //drawImage2();

  if (v.mode == 1) {
    draw1();
  } else if (v.mode == 2) {
    draw2();
  } else if (v.mode == 3) {
    draw3();
  }
  window.requestAnimationFrame(draw);
}

draw();
