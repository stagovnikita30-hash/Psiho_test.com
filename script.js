// --- ТВОЯ НАВИГАЦИЯ (БЕЗ ИЗМЕНЕНИЙ) ---
const menu = document.getElementById('leftMenu');
const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const chat = document.getElementById('chat');
const chatOpen = document.getElementById('chatOpen');
const chatClose = document.getElementById('chatClose');

menuOpen.onclick = () => { menu.style.transform = 'translateX(0)'; menuOpen.style.opacity = '0'; menuOpen.style.pointerEvents = 'none'; };
menuClose.onclick = () => { menu.style.transform = 'translateX(-340px)'; menuOpen.style.opacity = '1'; menuOpen.style.pointerEvents = 'auto'; };
chatOpen.onclick = () => { chat.style.transform = 'translateX(0)'; chatOpen.style.opacity = '0'; chatOpen.style.pointerEvents = 'none'; };
chatClose.onclick = () => { chat.style.transform = 'translateX(340px)'; chatOpen.style.opacity = '1'; chatOpen.style.pointerEvents = 'auto'; };

// --- ФОНОВОЕ СЛАЙДШОУ (УЛУЧШЕННОЕ) ---
const backgrounds = [
  'images/1.png','images/2.png','images/3.png','images/4.png',
  'images/5.png','images/6.png','images/7.png','images/8.png',
  'images/9.png','images/10.png','images/11.png','images/12.png'
];

let currentBg = 0;

// Создаем слои
const bgLayer1 = document.createElement('div');
const bgLayer2 = document.createElement('div');

[bgLayer1, bgLayer2].forEach(l => {
  Object.assign(l.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundSize: 'cover', backgroundPosition: 'center', 
    transition: 'opacity 3s ease-in-out', // Сделал чуть плавнее переход
    zIndex: '-2', opacity: '0', pointerEvents: 'none'
  });
  document.body.appendChild(l);
});

// Установка первого фона сразу
bgLayer1.style.backgroundImage = `url('${backgrounds[0]}')`;
bgLayer1.style.opacity = '1';

// Улучшенная предзагрузка: гарантируем, что картинка загружена перед показом
function changeBackground() {
  const nextIndex = (currentBg + 1) % backgrounds.length;
  const nextSrc = backgrounds[nextIndex];
  
  // Определяем, какой слой сейчас скрыт (в него будем грузить новую картинку)
  const topLayer = bgLayer1.style.opacity === '1' ? bgLayer2 : bgLayer1;
  const bottomLayer = topLayer === bgLayer1 ? bgLayer2 : bgLayer1;

  const tempImg = new Image();
  tempImg.src = nextSrc;
  
  // Важный момент: меняем фон только КОГДА картинка полностью скачана
  tempImg.onload = () => {
    topLayer.style.backgroundImage = `url('${nextSrc}')`;
    topLayer.style.opacity = '1';
    bottomLayer.style.opacity = '0';
    currentBg = nextIndex;
  };
}

// Запускаем цикл смены (раз в 15 секунд, как у тебя было)
setInterval(changeBackground, 15000);

// --- ТВОЯ ТРЯСКА (СОХРАНЕНА) ---
function anim(l) {
  let x=0, y=0, dx=0.02, dy=0.02;
  function step() {
    x+=dx; y+=dy; 
    if(Math.abs(x)>3) dx=-dx; 
    if(Math.abs(y)>3) dy=-dy;
    l.style.transform = `translate(${x}px, ${y}px) scale(1.03)`; // Чуть увеличил scale для запаса при тряске
    requestAnimationFrame(step);
  }
  step();
}
// Запускаем тряску на обоих слоях
anim(bgLayer1); 
anim(bgLayer2);

// --- ИНТЕРФЕЙС ---
const hideBtn = document.getElementById('hideUiBtn');
hideBtn.onclick = () => {
  document.body.classList.toggle('ui-hidden');
  hideBtn.innerHTML = document.body.classList.contains('ui-hidden') ? '✕' : '👁';
};
