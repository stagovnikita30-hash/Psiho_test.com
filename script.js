// -------------------- СЛАЙДШОУ ФОНА --------------------
const backgrounds = [
  'stalker-bg1.jpg',
  'stalker-bg2.jpg',
  'stalker-bg3.jpg',
  'stalker-bg4.jpg',
  'stalker-bg5.jpg',
  'stalker-bg6.jpg',
  'stalker-bg7.jpg',
  'stalker-bg8.jpg',
  'stalker-bg9.jpg',
  'stalker-bg10.jpg'
];

let currentBg = 0;

// Предзагрузка изображений
backgrounds.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Создаем два слоя для плавного перехода
const bgLayer1 = document.createElement('div');
const bgLayer2 = document.createElement('div');

[bgLayer1, bgLayer2].forEach(layer => {
  layer.style.position = 'fixed';
  layer.style.top = '0';
  layer.style.left = '0';
  layer.style.width = '100%';
  layer.style.height = '100%';
  layer.style.backgroundSize = 'cover';
  layer.style.backgroundPosition = 'center';
  layer.style.transition = 'opacity 2s ease-in-out';
  layer.style.zIndex = '-1';
  layer.style.opacity = '0';
  document.body.appendChild(layer);
});

// Устанавливаем первый фон сразу
bgLayer1.style.backgroundImage = `url('${backgrounds[0]}')`;
bgLayer1.style.opacity = '1';

function changeBackground() {
  const nextBg = (currentBg + 1) % backgrounds.length;
  const topLayer = bgLayer1.style.opacity == '1' ? bgLayer2 : bgLayer1;
  const bottomLayer = topLayer === bgLayer1 ? bgLayer2 : bgLayer1;

  topLayer.style.backgroundImage = `url('${backgrounds[nextBg]}')`;
  topLayer.style.opacity = '1';
  bottomLayer.style.opacity = '0';

  currentBg = nextBg;
}

// Меняем фон каждые 60 секунд
setInterval(changeBackground, 60000);
