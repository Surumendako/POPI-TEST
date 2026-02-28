const rain = document.getElementById("gummyRain");

function createGummy() {
  if (!rain) return;

  const g = document.createElement("div");
  g.classList.add("gummy");

  const size = 50 + Math.random() * 60;
  g.style.width = size + "px";
  g.style.height = size * 1.4 + "px";
  g.style.left = Math.random() * 100 + "vw";

  const fallTime = 7 + Math.random() * 6;
  g.style.animationDuration = `${fallTime}s`;

  rain.appendChild(g);
  setTimeout(() => g.remove(), fallTime * 1000);
}

if (rain) {
  setInterval(createGummy, 450);
}

let selectedStage = null;

document.querySelectorAll(".stage-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedStage = btn.dataset.stage;
    localStorage.setItem("startStage", selectedStage);

    document.querySelectorAll(".stage-btn").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");
  });
});

const startBtn = document.getElementById("startBtn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    if (!selectedStage) {
      alert("ステージを選択してください");
      return;
    }

    location.href = `test-que.html?stage=${selectedStage}&mode=textbook`;
  });
}