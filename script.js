// -------------------- DOM элементы --------------------
const submitBtn = document.getElementById("submitBtn"); 
const clearBtn = document.getElementById("clearBtn");
const resultDiv = document.getElementById("result");
const questions = document.querySelectorAll(".question");

// -------------------- МУЗЫКА --------------------
const bgMusic = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volumeControl");

// Список музыки
const musicList = [
  'stalker-music1.mp3','stalker-music2.mp3','stalker-music3.mp3',
  'stalker-music4.mp3','stalker-music5.mp3','stalker-music6.mp3',
  'stalker-music7.mp3','stalker-music8.mp3','stalker-music9.mp3','stalker-music10.mp3'
];
let musicIndex = 0;

// Настройки аудио
bgMusic.loop = false;
bgMusic.src = musicList[musicIndex];
bgMusic.volume = 0.005;

// Включаем музыку после первого клика
document.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

// Смена треков по окончании
bgMusic.addEventListener('ended', () => {
  musicIndex = (musicIndex + 1) % musicList.length;
  bgMusic.src = musicList[musicIndex];
  bgMusic.load(); 
  bgMusic.play();
});

// Управление громкостью
volumeControl.addEventListener("input", () => {
  bgMusic.volume = parseFloat(volumeControl.value);
  if (bgMusic.paused) bgMusic.play();
});

// -------------------- ВОССТАНОВЛЕНИЕ И СОХРАНЕНИЕ ОТВЕТОВ --------------------
questions.forEach(q => {
  const id = q.dataset.id;
  const saved = localStorage.getItem(`answer_${id}`);
  if (saved) q.querySelector("textarea").value = saved;
});

function saveAnswers() {
  questions.forEach(q => {
    const id = q.dataset.id;
    const answer = q.querySelector("textarea").value;
    if (answer.trim()) localStorage.setItem(`answer_${id}`, answer);
    else localStorage.removeItem(`answer_${id}`);
  });
}

// Очистка
clearBtn.addEventListener("click", () => {
  questions.forEach(q => q.querySelector("textarea").value = "");
  Object.keys(localStorage).forEach(key => { if (key.startsWith("answer_")) localStorage.removeItem(key); });
  resultDiv.innerText = "";
});

// -------------------- АНАЛИЗ --------------------
submitBtn.addEventListener("click", async () => {
  submitBtn.disabled = true;
  submitBtn.innerText = "Анализируем...";

  saveAnswers();

  let combinedText = "";
  questions.forEach(q => {
    combinedText += `${q.querySelector("label").innerText}\nОтвет: ${q.querySelector("textarea").value || "не отвечено"}\n\n`;
  });

  try {
    const res = await fetch("/api/analyze.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: combinedText })
    });

    const data = await res.json();
    resultDiv.innerText = data.analysis;
  } catch (err) {
    resultDiv.innerText = "Ошибка при анализе.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Анализировать";
  }
});

// -------------------- СЛАЙДШОУ ФОНА --------------------
const backgrounds = [
  'stalker-bg1.jpg','stalker-bg2.jpg','stalker-bg3.jpg','stalker-bg4.jpg','stalker-bg5.jpg',
  'stalker-bg6.jpg','stalker-bg7.jpg','stalker-bg8.jpg','stalker-bg9.jpg','stalker-bg10.jpg'
];
let currentBg = 0;
backgrounds.forEach(src => { const img = new Image(); img.src = src; });

const bgLayer1 = document.createElement('div');
const bgLayer2 = document.createElement('div');
[bgLayer1, bgLayer2].forEach(layer => {
  Object.assign(layer.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundSize: 'cover', backgroundPosition: 'center',
    transition: 'opacity 2s ease-in-out', zIndex: '-2', opacity: '0', pointerEvents: 'none'
  });
  document.body.appendChild(layer);
});
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
setInterval(changeBackground, 60000);

// -------------------- СКАЧИВАНИЕ WORD --------------------
function downloadWord(text, filename = "analysis.doc") {
  const paragraphs = text.split(/\n+/).map(line => `<p>${line}</p>`).join('');
  const blob = new Blob([`
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"></head>
    <body>${paragraphs}</body></html>`], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// -------------------- КНОПКА WORD РЯДОМ --------------------
const downloadBtn = document.createElement("button");
downloadBtn.innerText = "Скачать Word";
downloadBtn.style.cssText = `
  background: #2b3b4d; color: #fff; border-radius: 10px; 
  padding: 0.6rem 1rem; cursor: pointer; font-weight: 600; 
  margin-left: 6px;
`;
downloadBtn.addEventListener("mouseover", () => downloadBtn.style.transform = "scale(1.03)");
downloadBtn.addEventListener("mouseout", () => downloadBtn.style.transform = "scale(1)");
downloadBtn.addEventListener("click", () => {
  if (!resultDiv.innerText || resultDiv.innerText.trim().length < 5) {
    alert("Сначала получите результат анализа.");
    return;
  }
  downloadWord(resultDiv.innerText, "analysis.doc");
});

// Добавляем кнопку рядом с остальными
document.querySelector(".buttons").appendChild(downloadBtn);
