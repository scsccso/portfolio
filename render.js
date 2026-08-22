// render.js — 读取 content.js 的数据,渲染进 index.html 的 bento 网格挂载点,
// 并管理点击展开为居中弹层的交互。普通 script(非 type="module"),原因见
// 文件末尾说明。按 CLAUDE.md「页面结构」把七个模块渲染到对应网格位置;
// Skills / Experience / CineVerse 三个内容量较大的模块支持点击展开。

// 头像占位 + 联系方式图标:纯内联 SVG,不引入图标库/图片资源。
const AVATAR_PLACEHOLDER_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"></path></svg>';

const CONTACT_ICONS = {
  email:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20H6.94V8.5ZM5.25 4C4.01 4 3 5.01 3 6.25S4.01 8.5 5.25 8.5 7.5 7.49 7.5 6.25 6.49 4 5.25 4Z"/><path d="M9.5 8.5H12.75V10.06H12.8C13.26 9.2 14.37 8.3 16.03 8.3C19.44 8.3 20.06 10.53 20.06 13.43V20H16.69V14.11C16.69 12.72 16.66 10.94 14.75 10.94C12.81 10.94 12.5 12.45 12.5 14.01V20H9.5V8.5Z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.19-3.37-1.19-.46-1.19-1.11-1.51-1.11-1.51-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.9-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.5A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>',
};

function renderIdentityAvatar() {
  const { avatar, name } = content.identity;
  if (avatar) {
    return `<img src="${avatar}" alt="${name}" />`;
  }
  return AVATAR_PLACEHOLDER_ICON;
}

function buildContactLinks() {
  const { email, linkedin, github } = content.contact;
  return [
    { type: "email", href: `mailto:${email}`, label: "Email", external: false },
    { type: "linkedin", href: linkedin, label: "LinkedIn", external: true },
    { type: "github", href: github, label: "GitHub", external: true },
  ];
}

// 身份卡:头像 + 姓名 + 职位定位 + About 摘要 + 联系方式图标。
function renderIdentity() {
  const mount = document.getElementById("identity-mount");
  if (!mount) return;
  const { name, role } = content.identity;

  mount.innerHTML = `
    <div class="identity-avatar">${renderIdentityAvatar()}</div>
    <h1 class="identity-name">${name}</h1>
    <span class="identity-role eyebrow-badge">${role}</span>
    <p class="identity-about">${content.about.summary}</p>
    <ul class="identity-contacts">
      ${buildContactLinks()
        .map(
          (c) => `
        <li>
          <a
            class="identity-contact-link"
            href="${c.href}"
            aria-label="${c.label}"
            ${c.external ? 'target="_blank" rel="noopener"' : ""}
          >${CONTACT_ICONS[c.type]}</a>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

// CineVerse 项目大模块:白底 + 大装饰数字,摘要 + 精选技术栈 + GitHub 链接。
// .card-face-summary 是摘要(默认可见),.card-face-full 是空壳,展开时
// 由 initExpandInteractions 注入完整内容并淡入(见文件底部)。
function renderProjectCard() {
  const mount = document.getElementById("project-mount");
  if (!mount) return;
  const { name, summary, stack, githubUrl } = content.project;

  mount.innerHTML = `
    <div class="card-face-summary">
      <span class="card-number" aria-hidden="true">01</span>
      <span class="bento-eyebrow">Featured Project</span>
      <h2 class="bento-card-title cineverse-title">${name}</h2>
      <p class="bento-card-summary">${summary}</p>
      <ul class="stack-tags compact">
        ${stack.map((tech) => `<li class="stack-tag">${tech}</li>`).join("")}
      </ul>
      <a class="btn-pill btn-pill-sm" href="${githubUrl}" target="_blank" rel="noopener">View on GitHub</a>
    </div>
    <div class="card-face-full"></div>
  `;
}

// 技术栈模块:CineVerse 技术栈的 pill 列表摘要。
function renderTechStack() {
  const mount = document.getElementById("techstack-mount");
  if (!mount) return;
  const { caption, items } = content.techStack;

  mount.innerHTML = `
    <h2 class="bento-card-title">Tech Stack</h2>
    <p class="bento-card-caption">${caption}</p>
    <ul class="stack-tags compact">
      ${items.map((tech) => `<li class="stack-tag">${tech}</li>`).join("")}
    </ul>
  `;
}

// 关键数字卡:由 CineVerse 技术栈数量算出的真实统计,不是编造成就。
function renderStats() {
  const mount = document.getElementById("stats-mount");
  if (!mount) return;
  const { value, unit, label, caption } = content.stats;

  mount.innerHTML = `
    <span class="stats-value">${value}${unit || ""}</span>
    <span class="stats-label">${label}</span>
    <p class="stats-caption">${caption}</p>
  `;
}

// 技能模块摘要:四个分类标题,具体技能条目仍是 TODO(见 content.js)。
function renderSkillsCard() {
  const mount = document.getElementById("skills-mount");
  if (!mount) return;

  mount.innerHTML = `
    <div class="card-face-summary">
      <h2 class="bento-card-title">Skills</h2>
      <ul class="bento-summary-list">
        ${content.skills.categories.map((c) => `<li>${c.title}</li>`).join("")}
      </ul>
    </div>
    <div class="card-face-full"></div>
  `;
}

// 工作经历模块摘要:公司名称列表,职位/时间段/详情仍是 TODO。
function renderExperienceCard() {
  const mount = document.getElementById("experience-mount");
  if (!mount) return;

  mount.innerHTML = `
    <div class="card-face-summary">
      <h2 class="bento-card-title">Experience</h2>
      <ul class="bento-summary-list">
        ${content.experience.positions.map((p) => `<li><strong>${p.company}</strong></li>`).join("")}
      </ul>
    </div>
    <div class="card-face-full"></div>
  `;
}

// 联系方式模块:三个主要联系渠道的按钮。
function renderContactCard() {
  const mount = document.getElementById("contact-mount");
  if (!mount) return;
  const { email, linkedin, github } = content.contact;

  mount.innerHTML = `
    <div class="contact-info">
      <h2 class="bento-card-title">Contact</h2>
      <p class="bento-card-caption">Open to backend / full-stack roles.</p>
    </div>
    <div class="contact-actions compact">
      <a class="btn-pill btn-pill-sm" href="mailto:${email}">Email</a>
      <a class="btn-pill btn-pill-outline btn-pill-sm" href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn-pill btn-pill-outline btn-pill-sm" href="${github}" target="_blank" rel="noopener">GitHub</a>
    </div>
  `;
}

// ---------- 点击展开:完整内容构建 ----------
// .card-face-full 展开时被注入的完整内容,对应 index.html 中
// .is-expandable 卡片的 data-expand 值。每个 builder 接收一个 titleId,
// 供 <h2> 用作 aria-labelledby 的目标。

function buildSkillsFullContent(titleId) {
  return `
    <h2 id="${titleId}" class="full-title">Skills</h2>
    <div class="full-skills-grid">
      ${content.skills.categories
        .map(
          (category) => `
        <div class="full-skills-category">
          <h3>${category.title}</h3>
          <ul class="stack-tags">${category.items.map((item) => `<li class="stack-tag">${item}</li>`).join("")}</ul>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function buildExperienceFullContent(titleId) {
  return `
    <h2 id="${titleId}" class="full-title">Experience</h2>
    ${content.experience.positions
      .map(
        (p) => `
      <div class="full-experience-item">
        <h3>${p.company}</h3>
        <p class="full-experience-role">${p.role} · ${p.period}</p>
        <p>${p.summary}</p>
      </div>
    `
      )
      .join("")}
  `;
}

function buildProjectFullContent(titleId) {
  const { name, description, stack, githubUrl, highlights } = content.project;

  return `
    <h2 id="${titleId}" class="full-title">${name}</h2>
    <p class="full-project-description">${description}</p>
    <ul class="stack-tags">${stack.map((tech) => `<li class="stack-tag">${tech}</li>`).join("")}</ul>
    <a class="btn-pill" href="${githubUrl}" target="_blank" rel="noopener">View on GitHub</a>
    <div class="full-highlights-grid">
      ${highlights
        .map(
          (h, index) => `
        <div class="highlight-card">
          <span class="card-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <h3>${h.title}</h3>
          <p>${h.description}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

const FULL_CONTENT_BUILDERS = {
  skills: buildSkillsFullContent,
  experience: buildExperienceFullContent,
  cineverse: buildProjectFullContent,
};

// ---------- 点击展开:交互逻辑 ----------
// 关键约束:放大的必须是被点击的那张卡片本身(同一个 DOM 节点),不是
// 另外生成的弹层元素。做法(手写 FLIP,不用 View Transitions API——
// 原因见文件末尾说明):
//   1. 记录卡片当前的 rect(first),在它原来的网格位置插入一个同尺寸
//      的占位 div(borrow 它的 class 以获得同样的 grid-area),让网格
//      不因卡片离开而重新排列。
//   2. 把卡片本身 appendChild 到 document.body(脱离 bentoGrid,这样
//      之后对 bentoGrid 设置 inert 就不会连带把卡片自己也弄成 inert),
//      设为 position:fixed 并把 top/left/width/height 直接设成目标
//      展开框(屏幕居中,约 85vw/80vh)。
//   3. 立刻叠加一个 translate+scale,把它"拉回" first 的位置/大小(视觉
//      上完全看不出变化),强制回流后,在下一帧把 transform 过渡回
//      identity —— 这就是卡片从原位置/尺寸"长大"到居中大框的动画。
//   4. 卡片内部 .card-face-summary 淡出、.card-face-full(此时才注入
//      完整内容)延迟淡入,配合放大动作,而不是一开始就塞进小卡片里。
//   5. 关闭是同一套 FLIP 反过来播放:目标 rect 换成占位 div 的 rect,
//      动画结束后把卡片重新插回占位 div 的位置并移除占位 div。
// 背景其余卡片在展开期间整体降低透明度/轻微缩小/模糊,和遮罩一起构成
// "这张卡片被拉到最前面"的观感。

function initExpandInteractions() {
  const bentoGrid = document.getElementById("bento-grid");
  const backdrop = document.getElementById("expand-backdrop");
  if (!bentoGrid || !backdrop) return;

  let liftedCard = null;
  let placeholder = null;
  let previouslyFocused = null;
  let isCollapsing = false;
  let finalizeTimer = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // 展开后的目标框:屏幕居中,约占视口 85% 宽 / 80% 高,并设上限避免
  // 大屏幕上过大。
  function targetGeometry() {
    const width = Math.min(window.innerWidth * 0.85, 960);
    const height = Math.min(window.innerHeight * 0.8, 680);
    return {
      width,
      height,
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
    };
  }

  // 由两个 rect 算出"从 toRect 的框还原成 fromRect 的框"所需的
  // translate + scale,即经典 FLIP 的 Invert 步骤。
  function flipTransform(fromRect, toRect) {
    const dx = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const dy = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  }

  function expandCard(card) {
    if (liftedCard) return;
    const moduleId = card.dataset.expand;
    const builder = FULL_CONTENT_BUILDERS[moduleId];
    const fullFace = card.querySelector(".card-face-full");
    const closeBtn = card.querySelector(".card-close-btn");
    if (!builder || !fullFace || !closeBtn) return;

    previouslyFocused = document.activeElement;
    liftedCard = card;

    const firstRect = card.getBoundingClientRect();

    // 占位 div:借用卡片当前的 class(含模块名,如 "cineverse"),从而
    // 复用同一条 grid-area 规则,原地"顶替"卡片在网格里的位置。
    placeholder = document.createElement("div");
    placeholder.className = `${card.className.replace("is-expandable", "").trim()} bento-card-placeholder`;
    placeholder.style.width = `${firstRect.width}px`;
    placeholder.style.height = `${firstRect.height}px`;
    placeholder.setAttribute("aria-hidden", "true");
    card.parentNode.insertBefore(placeholder, card);

    const titleId = `${card.id}-full-title`;
    fullFace.innerHTML = builder(titleId);

    // 卡片本身脱离 bentoGrid,挪到 body 下:既让它不受下面 inert 影响,
    // 也让 position:fixed 稳定地相对视口定位。
    document.body.appendChild(card);

    const target = targetGeometry();
    const reduceMotion = prefersReducedMotion();

    card.style.transition = "none";
    card.style.position = "fixed";
    card.style.top = `${target.top}px`;
    card.style.left = `${target.left}px`;
    card.style.width = `${target.width}px`;
    card.style.height = `${target.height}px`;
    card.style.margin = "0";
    card.style.zIndex = "200";
    card.style.transform = reduceMotion ? "none" : flipTransform(firstRect, target);
    if (reduceMotion) card.style.opacity = "0";

    void card.offsetWidth; // 强制回流,确保上面的起始状态(小卡片)先生效

    // .is-lifted 必须在强制回流"之后"才加:它驱动 .card-face-summary/
    // .card-face-full 的交叉淡入淡出(各自声明了自己的 transition,不
    // 依赖卡片的 transition)。如果在回流之前就加上,浏览器会把这次
    // opacity 变化和上面那次回流合并成同一次样式计算,导致两层内容
    // 直接瞬间切换、动画被"吞掉"——曾经在这里踩过这个坑。
    card.classList.add("is-lifted", "is-morphing");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-expanded", "true");
    card.setAttribute("aria-labelledby", titleId);
    card.removeAttribute("aria-haspopup");

    bentoGrid.classList.add("has-lifted-card");
    bentoGrid.inert = true;
    document.body.style.overflow = "hidden";
    backdrop.classList.add("is-visible");

    requestAnimationFrame(() => {
      if (reduceMotion) {
        card.style.transition = "opacity 150ms ease";
        card.style.opacity = "1";
      } else {
        card.style.transition = "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 350ms ease";
        card.style.transform = "translate(0, 0) scale(1, 1)";
      }
    });

    document.addEventListener("keydown", onKeydown);
    closeBtn.focus();
  }

  function collapseCard() {
    if (!liftedCard || isCollapsing) return;
    isCollapsing = true;
    const card = liftedCard;
    const reduceMotion = prefersReducedMotion();

    if (finalizeTimer) {
      clearTimeout(finalizeTimer);
      finalizeTimer = null;
    }

    card.setAttribute("aria-expanded", "false");
    bentoGrid.classList.remove("has-lifted-card");
    bentoGrid.inert = false;
    document.body.style.overflow = "";
    backdrop.classList.remove("is-visible");
    document.removeEventListener("keydown", onKeydown);

    // 提前(而不是等 finalize)去掉 .is-lifted:让 .card-face-full 淡出、
    // .card-face-summary 淡回,和卡片收缩同步进行,而不是等卡片已经缩
    // 回小尺寸后,完整内容才突然消失、摘要突然出现。
    card.classList.remove("is-lifted");
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "true");
    card.removeAttribute("aria-modal");
    card.removeAttribute("aria-labelledby");

    // 展开动画的反向播放:从卡片当前(居中放大)的 rect 收缩回占位 div
    // 所在的位置/大小,而不是瞬间消失。
    if (reduceMotion) {
      card.style.transition = "opacity 150ms ease";
      card.style.opacity = "0";
    } else {
      const currentRect = card.getBoundingClientRect();
      const targetRect = placeholder.getBoundingClientRect();
      card.style.transition = "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      card.style.transform = flipTransform(targetRect, currentRect);
    }

    let finalized = false;
    function finalize() {
      if (finalized) return;
      finalized = true;
      card.removeEventListener("transitionend", onTransitionEnd);

      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.width = "";
      card.style.height = "";
      card.style.margin = "";
      card.style.zIndex = "";
      card.style.transform = "";
      card.style.transition = "";
      card.style.opacity = "";

      placeholder.parentNode.insertBefore(card, placeholder);
      placeholder.remove();
      placeholder = null;

      const fullFace = card.querySelector(".card-face-full");
      if (fullFace) fullFace.innerHTML = "";

      if (document.contains(card)) {
        card.focus();
      } else if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }

      // 通知其它模块(比如手机端卡片堆叠)这张卡片已经收起归位,可以
      // 重新计算自己的布局了,不直接依赖这里的内部实现。
      card.dispatchEvent(new CustomEvent("bento:collapsed", { bubbles: true }));

      liftedCard = null;
      isCollapsing = false;

      // 装饰数字的淡入要等卡片在新的 DOM 位置"定妥"一帧之后再触发——
      // reparent(insertBefore 到新父节点)和"移除 .is-morphing 触发
      // opacity 过渡"如果发生在同一个同步任务里,过渡会被吞掉直接跳到
      // 终值,和之前 is-lifted 撞上强制回流是同一类坑,这次换成了
      // reparent 触发。强制回流一次,确保浏览器先把"卡片已经在新位置"
      // 这件事定下来,再在下一帧改 class 触发过渡。
      void card.offsetWidth;
      requestAnimationFrame(() => {
        card.classList.remove("is-morphing");
      });
    }
    function onTransitionEnd(event) {
      if (event.target === card) finalize();
    }
    card.addEventListener("transitionend", onTransitionEnd);
    // 兜底:极端情况下 transitionend 未触发时,仍要清理状态。
    finalizeTimer = setTimeout(finalize, 550);
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      collapseCard();
    }
  }

  bentoGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".bento-card.is-expandable");
    if (!card) return;
    // 卡片内部的真实链接(如 GitHub 按钮)保持默认导航行为,不触发展开。
    const interactiveChild = event.target.closest("a, button");
    if (interactiveChild && interactiveChild !== card) return;
    expandCard(card);
  });

  bentoGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".bento-card.is-expandable");
    if (!card || event.target !== card) return;
    event.preventDefault();
    expandCard(card);
  });

  backdrop.addEventListener("click", collapseCard);

  // 关闭按钮活在被展开的卡片里(展开时卡片已 reparent 到 body),用
  // body 级委托代替给每个按钮单独绑定/解绑监听。折叠状态下按钮本身
  // pointer-events:none,不会被误触发。
  document.body.addEventListener("click", (event) => {
    if (event.target.closest(".card-close-btn")) {
      collapseCard();
    }
  });
}

// ---------- 手机端:Apple Wallet 风格层叠卡片 ----------
// 只在 <768px 生效(见 styles.css 对应断点)。#mobile-stack 下六个
// 模块用一个 order 数组表示当前堆叠顺序,layoutStack() 按数组下标把
// 每张卡片摆到它在堆叠里第几层的位置(index=0 是最上层)。原生
// Pointer Events 实现拖拽:
//   - pointerdown 记录起点,只响应当前最上层卡片
//   - pointermove 让卡片跟手指走(横向位移 + 轻微旋转)
//   - pointerup:
//       · 几乎没移动 → 判定为点击,转发给已有的展开机制(card.click()
//         触发 initExpandInteractions 里委托在 #bento-grid 上的
//         click 监听,不需要互相引用内部函数)
//       · 横向移动超过卡片宽度 30% → 判定为划走:该卡片飞出屏幕,
//         同时其余卡片补位到新的堆叠顺序,原卡片转一圈排到最后
//       · 否则 → 判定为没划够,回弹到原位(复用 layoutStack 的弹性
//         过渡,不用另外写一套回弹逻辑)
// 卡片展开期间会被 reparent 到 body,layoutStack 用 .is-lifted 跳过它;
// 收起完成后 render.js 会在 card 上派发 "bento:collapsed" 事件,这里
// 监听它来在下一次开合后重新摆位(万一它在堆叠中的几何被展开机制的
// 内联样式覆盖过)。
function initMobileStack() {
  const STACK_ORDER = ["cineverse", "skills", "experience", "techstack", "stats", "contact"];
  const CARD_HEIGHT = 220; // 需要和 styles.css 里 .mobile-stack .bento-card 的 height 保持一致
  const PEEK = 18; // 每往后一层露出的边缘,落在 CLAUDE.md 要求的 15-20px 区间
  const SCALE_STEP = 0.035;
  const OPACITY_STEP = 0.07;
  const DISMISS_THRESHOLD_RATIO = 0.3;
  const TAP_SLOP = 8; // px,超过这个移动量就不算点击,按拖拽处理

  const stackEl = document.getElementById("mobile-stack");
  if (!stackEl) return;

  const mq = window.matchMedia("(max-width: 767px)");
  let order = STACK_ORDER.slice();
  let mobileActive = mq.matches;
  let flyingCard = null;
  let drag = null; // { card, pointerId, startX, startY, maxMove }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function cardEl(moduleId) {
    // 排除占位 div:展开期间它借用同一个模块名的 class(为了拿到同一条
    // grid-area 规则,见 initExpandInteractions),会和真正的卡片撞选
    // 择器——真正的卡片这时已经被 reparent 到 body,但占位 div 还留在
    // #mobile-stack 里,不排除的话 querySelector 会先匹配到它。
    const selector = `.bento-card.${moduleId}:not(.bento-card-placeholder)`;
    return stackEl.querySelector(selector) || document.querySelector(selector);
  }

  function settleTransition(reduceMotion) {
    return reduceMotion ? "transform 160ms ease, opacity 160ms ease" : "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease";
  }

  // 把 order 数组里的每张卡片摆到它当前下标对应的堆叠位置。飞出中的
  // 卡片(flyingCard)跳过,它的落位由 dismissFrontCard 自己的动画流程
  // 负责,不能被这里的"立刻摆好"打断。
  function layoutStack(withTransition) {
    if (!mobileActive) return;
    const reduceMotion = prefersReducedMotion();
    order.forEach((moduleId, index) => {
      const card = cardEl(moduleId);
      if (!card || card === flyingCard || card.classList.contains("is-lifted")) return;
      // reduced motion 只改"怎么过渡"(见 settleTransition,弹性曲线
      // 换成简单的 ease),不改层叠本身的静态外观——露出边缘的层叠
      // 视觉不是"动效",没有理由跟着弹性缓动一起被去掉。
      card.style.transition = withTransition ? settleTransition(reduceMotion) : "none";
      card.style.zIndex = String(order.length - index);
      const scale = Math.max(1 - index * SCALE_STEP, 0.85);
      card.style.transform = `translateY(${index * PEEK}px) scale(${scale})`;
      card.style.opacity = String(Math.max(1 - index * OPACITY_STEP, 0.75));
      card.style.pointerEvents = index === 0 ? "auto" : "none";
    });
    stackEl.style.height = `${CARD_HEIGHT + (order.length - 1) * PEEK}px`;
  }

  function clearStackStyles() {
    STACK_ORDER.forEach((moduleId) => {
      const card = cardEl(moduleId);
      if (!card) return;
      card.style.transform = "";
      card.style.zIndex = "";
      card.style.opacity = "";
      card.style.pointerEvents = "";
      card.style.transition = "";
    });
    stackEl.style.height = "";
  }

  // 划走判定成立后:卡片自己飞出屏幕(简单的 ease-out,不用弹性曲线,
  // 弹性曲线只用于"回到/落入堆叠位置"这类场景);同时立刻把 order
  // 转一圈("最上层挪到最后"),让其余卡片马上跟着补位到新的堆叠顺序,
  // 两个动画同时发生。飞出动画结束后,再把这张卡片无过渡地"放"到它
  // 现在(堆叠最底层)该在的位置。
  function dismissFrontCard(card, dx) {
    const reduceMotion = prefersReducedMotion();
    flyingCard = card;
    card.style.pointerEvents = "none";

    order.push(order.shift());

    if (reduceMotion) {
      card.style.transition = "opacity 160ms ease";
      card.style.transform = "translateY(0) scale(1)";
      card.style.opacity = "0";
    } else {
      const direction = dx >= 0 ? 1 : -1;
      const flyX = direction * (stackEl.getBoundingClientRect().width + 240);
      card.style.transition = "transform 320ms ease-in, opacity 300ms ease-in";
      card.style.transform = `translate(${flyX}px, ${dx * 0.25}px) rotate(${direction * 20}deg)`;
      card.style.opacity = "0";
    }

    layoutStack(true); // 其余卡片带过渡立刻补位,和飞出动画同时进行

    let cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      card.removeEventListener("transitionend", onEnd);
      flyingCard = null;
      card.style.transition = "none";
      card.style.opacity = "";
      layoutStack(false); // 无过渡地把它放到堆叠最底层该在的位置
      void card.offsetWidth;
    }
    function onEnd(event) {
      if (event.target === card) cleanup();
    }
    card.addEventListener("transitionend", onEnd);
    setTimeout(cleanup, reduceMotion ? 260 : 450);
  }

  function onPointerDown(event) {
    if (!mobileActive || drag) return;
    const card = event.target.closest(".bento-card");
    if (!card || card.parentElement !== stackEl) return;
    if (card !== cardEl(order[0])) return; // 只有最上层卡片能拖
    if (card.classList.contains("is-lifted")) return;

    drag = {
      card,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      maxMove: 0,
      width: card.getBoundingClientRect().width,
    };
    card.style.transition = "none";
    try {
      card.setPointerCapture(event.pointerId);
    } catch (err) {
      // 部分环境(比如某些自动化测试)可能不支持,拖拽仍靠坐标计算,
      // 不影响功能,静默忽略。
    }
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    drag.lastDx = dx;
    drag.maxMove = Math.max(drag.maxMove, Math.abs(dx), Math.abs(dy));
    const rotate = Math.max(-14, Math.min(14, dx / 14));
    drag.card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
  }

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const { card, maxMove, width, lastDx } = drag;
    const dx = lastDx || 0;
    try {
      card.releasePointerCapture(event.pointerId);
    } catch (err) {
      // 同上,忽略不支持的环境
    }
    drag = null;

    if (maxMove < TAP_SLOP) {
      // 判定为点击:先无过渡地归位,再转发成一次真正的点击事件,交给
      // 已有的展开机制处理(它会自己检查 .is-expandable / data-expand)。
      card.style.transition = "none";
      card.style.transform = "";
      layoutStack(false);
      card.click();
      return;
    }

    if (Math.abs(dx) > width * DISMISS_THRESHOLD_RATIO) {
      dismissFrontCard(card, dx);
    } else {
      layoutStack(true); // 没划够阈值,order 没变,统一走 layoutStack 弹回原位
    }
  }

  function onPointerCancel(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag = null;
    layoutStack(true);
  }

  function handleBreakpointChange(event) {
    mobileActive = event.matches;
    if (mobileActive) {
      layoutStack(false);
    } else {
      clearStackStyles();
    }
  }

  stackEl.addEventListener("pointerdown", onPointerDown);
  stackEl.addEventListener("pointermove", onPointerMove);
  stackEl.addEventListener("pointerup", endDrag);
  stackEl.addEventListener("pointercancel", onPointerCancel);

  // 某张卡片点击展开、又收起完成后,重新按当前 order 摆位(它在展开期间
  // 被展开机制的内联样式接管过,收起后几何已经清空,需要重新交给堆叠)。
  document.addEventListener("bento:collapsed", (event) => {
    if (!mobileActive) return;
    if (!STACK_ORDER.includes(event.target.dataset.expand)) return;
    layoutStack(false);
  });

  mq.addEventListener("change", handleBreakpointChange);

  if (mobileActive) layoutStack(false);
}

function renderPage() {
  renderIdentity();
  renderProjectCard();
  renderTechStack();
  renderStats();
  renderSkillsCard();
  renderExperienceCard();
  renderContactCard();
  initExpandInteractions();
  initMobileStack();
}

// 为什么不用 View Transitions API(document.startViewTransition):
// 它确实能做"同一元素跨状态平滑变形"且自带内容 cross-fade,但截至本
// 项目开发时 Firefox 仍不完整支持同文档视图过渡,面向 career fair /
// 面试官临场访问的场景里,不想让效果在不同浏览器上表现不一致,也不想
// 维护两套动画路径。上面手写的 FLIP(transform 位移缩放 + 内容淡入淡出
// 顺序编排)已经能精确控制"先长大、再淡入完整内容"的节奏,且只依赖
// CSS Transitions + transform,兼容性覆盖到所有现代浏览器,没有回退
// 分支的必要。

// 本文件通过 <script src="render.js"> 加载,不使用 type="module":
// - 无构建工具,页面可能被直接以 file:// 打开做本地预览,ES module 在
//   file:// 下会触发浏览器 CORS 限制而加载失败,普通 script 没有这个问题。
// - content.js 用普通 script 先加载,顶层 const 声明的绑定在同一文档的
//   后续普通 script 间是共享可见的,不需要 import/export 就能拿到 content。
// script 标签放在 </body> 前、所有挂载点 DOM 已解析完毕之后执行,
// 因此不需要等待 DOMContentLoaded,直接调用即可。
renderPage();
