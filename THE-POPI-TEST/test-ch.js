const params = new URLSearchParams(location.search);
const stage = Number(
  params.get("stage") || localStorage.getItem("POPI_CH_STAGE") || 1
);
const mode =
  params.get("mode") || localStorage.getItem("POPI_CH_MODE") || "textbook";

localStorage.setItem("POPI_CH_STAGE", stage);
localStorage.setItem("POPI_CH_MODE", mode);

const allWords = JSON.parse(localStorage.getItem("POPI_CH_DATA") || "[]");
const wrongWords = JSON.parse(localStorage.getItem("POPI_WRONG_WORDS") || "[]");

if (!allWords.length) {
  alert("先にステージを開始してください");
  location.href = `../text/test-que.html?mode=${mode}&stage=${stage}`;
}

let showMode = "all";
let words = allWords.slice();
let index = 0;

const stageBadge = document.getElementById("stageBadge");
const wordMain = document.getElementById("wordMain");
const wordSub = document.getElementById("wordSub");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toggleBtn = document.getElementById("toggleBtn");

function render() {
  stageBadge.textContent = `STAGE ${stage}`;

  if (!words.length) {
    wordMain.textContent = "単語がありません";
    wordSub.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  wordMain.textContent = words[index].english;
  wordSub.textContent = words[index].japanese;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === words.length - 1;
}

render();

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};

nextBtn.onclick = () => {
  if (index < words.length - 1) {
    index++;
    render();
  }
};

toggleBtn.onclick = () => {
  if (showMode === "all") {
    showMode = "wrong";
    words = wrongWords.slice();
    toggleBtn.textContent = "全単語を見る";
  } else {
    showMode = "all";
    words = allWords.slice();
    toggleBtn.textContent = "間違えた単語を見る";
  }
  index = 0;
  render();
};