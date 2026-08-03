const cards = [
  { image: "assets/photo-1.webp", title: "第一封祝福", text: "创新了一下哈哈，希望能给你一点惊喜，祝你在杜克大学的乐团玩得开心，22岁生日快乐~。", from: "周芯亦" },
  { image: "assets/photo-2.webp", title: "第二封祝福", text: "祝淇元姐姐生日快乐！！！很高兴我们能在乐团重逢，还记得去年我刚进群的时候你就主动加我我聊天，如同入室抢劫般闯入我的生活，让我在乐团一年的经历变得丰富多彩。不过就仅仅是短短一年的相处，我发现你不仅仅大提琴拉的好，摄影，排球也样样精通，交友也十分广泛，能很好地处理各种人际关系，解决问题。与你的相处让我感到愉快，也学到了很多为人处世的方法，现在回想起这一年我们一起创造了很多很多美好的回忆，感谢与你的相遇[爱心][爱心][爱心]最后，再次祝你生日快乐；祝你未来的日子一切顺利，前程似锦；祝你学业有成，万事顺遂；祝你遇见更多的美好，做不被定义的自己！但也不要有太大压力和焦虑，天天开心，健康快乐最重要！！！", from: "— 卓欣怡" },
  { image: "assets/photo-3.webp", title: "第三封祝福", text: "这一页先留白，等一句只属于 Josie 的真心话。", from: "— 陈茉晗" },
  { image: "assets/photo-4.webp", title: "第四封祝福", text: "愿每一次出发都有好风景，每一次回头都有温暖的人。", from: "— 袁悠然" },
  { image: "assets/photo-5.webp", title: "第五封祝福", text: "淇元姐生日快乐🎂🎈🎁🎊重复的话不说了[呲牙]祝你新的一岁在Duke继续闪闪发光，以后的每一天都健康平安幸福快乐充实每一天🥳😊☺️！", from: "— 马怿玮" },
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
