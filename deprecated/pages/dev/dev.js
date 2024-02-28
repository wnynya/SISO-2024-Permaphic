let images = [];

async function init() {
  images = await (await fetch('/api/images')).json();
}

function numbers(source) {
  const hash = md5(source);
  const list = [];
  for (let i = 0; i < hash.length; i += 2) {
    list.push(Number.parseInt(hash[i] + hash[i + 1], 16));
  }
  return list;
}

function getImage(n) {
  return new Promise((resolve) => {
    const image = new Image();
    const name = images[n % images.length];
    image.src = `/resources/permaphic/random-images/${name}`;
    image.onload = () => {
      resolve(image);
    };
  });
}

function getMix(n) {
  let opertaions = ['difference', 'color-dodge', 'hue', 'luminosity'];
  return opertaions[n[0] % opertaions.length];
}

function getFilter(n) {
  let filter = '';
  if (n[0] > 192) {
    let a = (n[1] + n[2]) % 360;
    filter += `hue-rotate(${a}deg) `;
  }
  if (n[3] > 192) {
    let a = (n[4] % 40) + 10;
    filter += `blur(${a}px) `;
  }
  if (n[5] > 192) {
    let a = n[6] % 100;
    filter += `invert(${a}%) `;
  }
  return filter;
}

async function render() {
  let n = [];
  for (let i = 0; i < 20; i++) {
    n.push(numbers(Math.random() + ''));
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  const perma = new Canvas(canvas);

  const images = await Promise.all([
    getImage(n[0][0]),
    getImage(n[0][1]),
    getImage(n[0][2]),
    getImage(n[0][3]),
  ]);

  perma.image(images[0], 0, 0, 1000, 1000, 'cover');

  perma.ctx.globalCompositeOperation = getMix(n[1]);
  perma.ctx.filter = getFilter(n[2]);
  console.log(perma.ctx.globalCompositeOperation, perma.ctx.filter);
  perma.image(images[1], 0, 0, 1000, 1000, 'cover');

  perma.ctx.globalCompositeOperation = getMix(n[3]);
  perma.ctx.filter = getFilter(n[4]);
  console.log(perma.ctx.globalCompositeOperation, perma.ctx.filter);
  perma.image(images[2], 0, 0, 1000, 1000, 'cover');

  perma.ctx.globalCompositeOperation = getMix(n[6]);
  perma.ctx.filter = getFilter(n[7]);
  console.log(perma.ctx.globalCompositeOperation, perma.ctx.filter);
  perma.image(images[3], 0, 0, 1000, 1000, 'cover');

  //graph1(perma, 5, 4, 5, 4, 1000, 10);
  perma.ctx.globalCompositeOperation = 'source-over';
  perma.ctx.filter = 'none';
  perma.ctx.fillStyle = 'rgb(255,255,0)';
  perma.ctx.font = '100px Galmuri11';
  perma.ctx.fillText('테스트 이미지 생성', 700, 800);

  const dCanvas = document.querySelector('#canvas');
  dCanvas.width = dCanvas.offsetWidth * 2;
  dCanvas.height = dCanvas.offsetHeight * 2;
  const dPerma = new Canvas(dCanvas);
  dPerma.image(perma.canvas, 0, 0, dCanvas.width, dCanvas.height, 'cover');
}

init();

document.querySelector('#render').addEventListener('click', () => {
  render();
});
