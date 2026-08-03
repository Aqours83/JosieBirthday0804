const cards = [
  { image: "assets/photo-1.webp", title: "第一封祝福", text: "创新了一下哈哈，希望能给你一点惊喜，祝你在杜克大学的乐团玩得开心，22岁生日快乐~。", from: "周芯亦" },
  { image: "assets/photo-2.webp", title: "第二封祝福", text: "愿新的一岁，喜欢的事情都能坚持，期待的答案都慢慢靠近。", from: "— 卓欣怡" },
  { image: "assets/photo-3.webp", title: "第三封祝福", text: "这一页先留白，等一句只属于 Josie 的真心话。", from: "— 陈茉晗" },
  { image: "assets/photo-4.webp", title: "第四封祝福", text: "愿每一次出发都有好风景，每一次回头都有温暖的人。", from: "— 袁悠然" },
  { image: "assets/photo-5.webp", title: "第五封祝福", text: "祝福还在收集中，很快就会把这一页认真写满。", from: "— 马怿玮" },
  { image: "assets/photo-6.webp", title: "第六封祝福", text: "生日快乐，愿新的一岁自由、明亮，也一直被爱包围。", from: "— 马雪琪" },
];

let order = cards.map((_, index) => index);
let animating = false;
const stack = document.querySelector("#postcard-stack");
const counter = document.querySelector("#current-number");
const intro = document.querySelector("#intro");
const wishes = document.querySelector("#wishes");
const previousButton = document.querySelector("#previous-card");
const nextButton = document.querySelector("#next-card");

function cardMarkup(card, originalIndex) {
  const article = document.createElement("article");
  article.className = "postcard";
  article.dataset.card = originalIndex;
  article.setAttribute("aria-label", `第 ${originalIndex + 1} 张明信片`);
  article.innerHTML = `
    <img class="postcard-photo" src="${card.image}" alt="Josie 的照片 ${originalIndex + 1}" />
    <div class="postcard-divider" aria-hidden="true"></div>
    <div class="postcard-message">
      <p class="card-label">Happy birthday · 2026</p>
      <h3>${card.title}</h3>
      <p class="message-text">${card.text}</p>
      <p class="signature">${card.from}</p>
    </div>`;
  return article;
}

function applyOrder() {
  order.forEach((cardIndex, depth) => {
    const card = stack.querySelector(`[data-card="${cardIndex}"]`);
    card.style.setProperty("--depth", depth);
    card.style.setProperty("--rotation", `${depth * 10}deg`);
    card.style.zIndex = order.length - depth;
    card.setAttribute("aria-hidden", depth === 0 ? "false" : "true");
  });
  counter.textContent = String(order[0] + 1).padStart(2, "0");
}

function buildStack() {
  cards.forEach((card, index) => stack.append(cardMarkup(card, index)));
  applyOrder();
}

function navigate(direction) {
  if (animating) return;
  animating = true;
  previousButton.disabled = true;
  nextButton.disabled = true;

  const topCard = stack.querySelector('.postcard[aria-hidden="false"]');
  topCard.classList.add(direction === "next" ? "is-leaving-next" : "is-leaving-prev");

  if (direction === "next") {
    order.push(order.shift());
  } else {
    order.unshift(order.pop());
  }

  requestAnimationFrame(() => applyOrder());

  window.setTimeout(() => {
    topCard.classList.remove("is-leaving-next", "is-leaving-prev");
    previousButton.disabled = false;
    nextButton.disabled = false;
    animating = false;
  }, 700);
}

document.querySelector("#open-wishes").addEventListener("click", () => {
  intro.classList.remove("is-active");
  intro.setAttribute("aria-hidden", "true");
  wishes.classList.add("is-active");
  wishes.setAttribute("aria-hidden", "false");
  window.setTimeout(() => nextButton.focus({ preventScroll: true }), 700);
});

nextButton.addEventListener("click", () => navigate("next"));
previousButton.addEventListener("click", () => navigate("previous"));

document.addEventListener("keydown", (event) => {
  if (!wishes.classList.contains("is-active")) return;
  if (event.key === "ArrowRight") navigate("next");
  if (event.key === "ArrowLeft") navigate("previous");
});

let pointerStart = null;
stack.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; });
stack.addEventListener("pointerup", (event) => {
  if (pointerStart === null) return;
  const distance = event.clientX - pointerStart;
  if (Math.abs(distance) > 45) navigate(distance < 0 ? "next" : "previous");
  pointerStart = null;
});
stack.addEventListener("pointercancel", () => { pointerStart = null; });

buildStack();
