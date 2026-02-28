const params = new URLSearchParams(location.search);

let stageNumber = parseInt(params.get("stage"));

if (!stageNumber || stageNumber < 1) {
  stageNumber = parseInt(localStorage.getItem("POPI_CH_STAGE")) || 1;
}

const mode =
  params.get("mode") ||
  localStorage.getItem("POPI_CH_MODE") ||
  "textbook";

localStorage.setItem("POPI_CH_STAGE", stageNumber);
localStorage.setItem("POPI_CH_MODE", mode);

if (
  !window.WORD_DATA ||
  !WORD_DATA[mode] ||
  !WORD_DATA[mode]["stage" + stageNumber]
) {
  alert("単語データが見つかりません");
  location.href = "index.html";
}

let questions = [...WORD_DATA[mode]["stage" + stageNumber]];
shuffle(questions);

let results = [];

let currentIndex = 0;
let currentInput = "";
let incorrectCount = 0;
let assistMode = 0;

const jpWordEl = document.getElementById("jpWord");
const answerEl = document.getElementById("answer");
const revealEl = document.getElementById("answerReveal");
const progressBar = document.getElementById("progressBar");
const keyboard = document.getElementById("keyboard");

function showNextQuestion() {
  if (currentIndex >= questions.length) return finishStage();

  const currentQ = questions[currentIndex];
  jpWordEl.textContent = `「${currentQ.japanese}」`;

  currentInput = "";
  incorrectCount = 0;
  assistMode = 0;

  answerEl.value = "";
  revealEl.textContent = "";
  revealEl.classList.remove("show");

  updateAssistKeys();
  updateProgress();
}

function add(char) {
  currentInput += char;
  answerEl.value = currentInput;
}

function del() {
  currentInput = currentInput.slice(0, -1);
  answerEl.value = currentInput;
}

function clearAll() {
  currentInput = "";
  answerEl.value = "";
}

function check() {
  if (!currentInput) return;

  const correct = questions[currentIndex].english;

  const isCorrect =
    currentInput.trim().toLowerCase() ===
    correct.trim().toLowerCase();

  if (isCorrect) {
    showJudge("correct");

    results.push({
      japanese: questions[currentIndex].japanese,
      correct: correct,
      userAnswer: currentInput,
      isCorrect: true
    });

    setTimeout(() => {
      currentIndex++;
      showNextQuestion();
    }, 600);

  } else {
    showJudge("wrong");
    incorrectCount++;

    if (incorrectCount >= 3) {
      showAnswerText();

      results.push({
        japanese: questions[currentIndex].japanese,
        correct: correct,
        userAnswer: currentInput,
        isCorrect: false
      });

      setTimeout(() => {
        currentIndex++;
        showNextQuestion();
      }, 1200);
    } else {
      setTimeout(clearAll, 400);
    }
  }
}

function showAnswerText() {
  revealEl.textContent = questions[currentIndex].english;
  revealEl.classList.add("show");
}

function useAssist() {
  assistMode = (assistMode + 1) % 2;
  updateAssistKeys();
}

function updateAssistKeys() {
  const correctChars =
    (questions[currentIndex]?.english || "").split("");

  const keys = document.querySelectorAll(".keyboard img");

  keys.forEach(img => {
    const keyChar =
      img.getAttribute("onclick")?.match(/'(.+)'/)?.[1];

    if (!keyChar) return;

    const isCorrectChar = correctChars.includes(keyChar);

    img.style.opacity =
      assistMode === 0 || isCorrectChar ? "1" : "0.25";
  });
}

function finishStage() {
  keyboard.style.display = "none";
  progressBar.style.width = "100%";

  const stageEndArea = document.getElementById("stageEndArea");
  stageEndArea.style.display = "block";

  showResultList();

  const nextStageNum = stageNumber + 1;
  const nextBtn = document.getElementById("nextStageBtn");

  if (WORD_DATA[mode]["stage" + nextStageNum]) {
    nextBtn.style.display = "inline";

    nextBtn.onclick = () => {
  
      localStorage.setItem("POPI_CH_STAGE", nextStageNum);

      location.href =
        location.pathname +
        "?mode=" + mode +
        "&stage=" + nextStageNum;
    };

  } else {
    nextBtn.style.display = "none";
  }
}

function showResultList() {
  const container = document.createElement("div");
  container.className = "result-list";

  results.forEach(r => {
    const item = document.createElement("div");
    item.className = "result-item";

    const icon = document.createElement("img");
    icon.src = r.isCorrect ? "pic/poo.png" : "pic/buu.png";
    icon.style.width = "24px";
    icon.style.verticalAlign = "middle";
    icon.style.marginRight = "8px";

    item.appendChild(icon);

    item.innerHTML += `
      <strong>${r.japanese}</strong><br>
      正解: ${r.correct}<br>
      あなた: ${r.userAnswer}
    `;

    container.appendChild(item);
  });

  document
    .getElementById("stageEndArea")
    .appendChild(container);
}

function updateProgress() {
  progressBar.style.width =
    (currentIndex / questions.length) * 100 + "%";
}

function showJudge(type) {
  const el = document.getElementById(type);
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

window.addEventListener("keydown", e => {
  if (currentIndex >= questions.length || e.repeat) return;
  if (e.key === "Enter") check();
  else if (e.key === "Backspace") del();
  else if (/^[a-z-]$/i.test(e.key)) add(e.key.toLowerCase());
});

document.getElementById("retryBtn").onclick = () => location.reload();
document.getElementById("quitBtn").onclick = () => location.href = "index.html";

showNextQuestion();