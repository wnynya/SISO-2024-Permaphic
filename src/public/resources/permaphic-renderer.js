importScripts('/resources/permaphic-canvas.js');

let images = [];
let element = {};
element.render = new OffscreenCanvas(1000, 1000);

let canvas = {};

onmessage = (e) => {
  const object = e.data;
  const event = object.event;
  const data = object.data;

  switch (event) {
    case 'init-graphic': {
      element.graphic = data;
      canvas.graphic = new Canvas(element.graphic);
      break;
    }
    case 'init-preview': {
      element.preview = data;
      canvas.preview = new Canvas(element.preview);
      break;
    }
    case 'render-fill': {
      render(element.render, data);
      break;
    }
    case 'render-clear': {
      clear();
      break;
    }
    case 'print': {
      print();
      break;
    }
  }
};

async function init() {
  images = await (await fetch('/api/images')).json();
}
init();

async function getImage(seed) {
  const name = images[seed[0] % images.length];
  const imgblob = await fetch(`/resources/images/${name}`).then((r) =>
    r.blob()
  );
  const img = await createImageBitmap(imgblob);

  return img;
}

function getMix(seed) {
  let opertaions = ['difference', 'color-dodge', 'hue', 'luminosity'];
  return opertaions[seed[0] % opertaions.length];
}

function getFilter(seed) {
  let filter = '';
  if (seed[0] > 192) {
    let a = (seed[1] + seed[2]) % 360;
    filter += `hue-rotate(${a}deg) `;
  }
  if (seed[3] > 192) {
    let a = (seed[4] % 40) + 10;
    filter += `blur(${a}px) `;
  }
  if (seed[5] > 192) {
    let a = seed[6] % 100;
    filter += `invert(${a}%) `;
  }
  return filter;
}

async function render(el, seeds) {
  const can = new Canvas(el);

  const images = await Promise.all([
    getImage(seeds[0]),
    getImage(seeds[2]),
    getImage(seeds[4]),
    getImage(seeds[8]),
  ]);

  can.image(images[0], 0, 0, 1000, 1000, 'cover');

  can.mix(getMix(seeds[1])).filter(getFilter(seeds[3]));
  can.image(images[1], 0, 0, 1000, 1000, 'cover');

  can.mix(getMix(seeds[5])).filter(getFilter(seeds[6]));
  can.image(images[2], 0, 0, 1000, 1000, 'cover');

  can.mix(getMix(seeds[7])).filter(getFilter(seeds[9]));
  can.image(images[3], 0, 0, 1000, 1000, 'cover');

  clear();
  canvas.graphic.fill(can);
  canvas.preview.fill(can);
}

function clear() {
  canvas.graphic.clear();
  canvas.preview.clear();
}

async function print() {
  const can = element.render;
  const blob = await can.convertToBlob();
  const data = new FileReaderSync().readAsDataURL(blob);
  const res = await (
    await fetch('/api/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: data,
      }),
    })
  ).json();

  console.log(res);
}
