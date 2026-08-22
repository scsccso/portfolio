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
// 点击展开时完整内容显示在独立弹层里(见 initExpandInteractions),这里
// 只渲染摘要,不需要额外的"完整内容"占位层。
function renderProjectCard() {
  const mount = document.getElementById("project-mount");
  if (!mount) return;
  const { name, summary, stack, githubUrl } = content.project;

  mount.innerHTML = `
    <span class="card-number" aria-hidden="true">01</span>
    <span class="bento-eyebrow">Featured Project</span>
    <h2 class="bento-card-title cineverse-title">${name}</h2>
    <p class="bento-card-summary">${summary}</p>
    <ul class="stack-tags compact">
      ${stack.map((tech) => `<li class="stack-tag">${tech}</li>`).join("")}
    </ul>
    <a class="btn-pill btn-pill-sm" href="${githubUrl}" target="_blank" rel="noopener">View on GitHub</a>
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
    <h2 class="bento-card-title">Skills</h2>
    <ul class="bento-summary-list">
      ${content.skills.categories.map((c) => `<li>${c.title}</li>`).join("")}
    </ul>
  `;
}

// 工作经历模块摘要:公司名称列表,职位/时间段/详情仍是 TODO。
function renderExperienceCard() {
  const mount = document.getElementById("experience-mount");
  if (!mount) return;

  mount.innerHTML = `
    <h2 class="bento-card-title">Experience</h2>
    <ul class="bento-summary-list">
      ${content.experience.positions.map((p) => `<li><strong>${p.company}</strong></li>`).join("")}
    </ul>
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
// 展开时注入独立弹层(.overlay-content,见 initExpandInteractions)的
// 完整内容,对应 index.html 中 .is-expandable 卡片的 data-expand 值。
// 每个 builder 接收一个 titleId,供 <h2> 用作 aria-labelledby 的目标。

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

// ---------- 点击展开:交互逻辑(原生 View Transitions API) ----------
// 用浏览器原生的 document.startViewTransition 替换上一版手写的"独立
// 弹层缩放"实现(2026年主流浏览器——Chrome 111+/Safari 18+/Firefox
// 144+——都已支持)。核心思路:给触发卡片和展开后的面板动态设置同一个
// view-transition-name(按模块 id 生成,如 "card-cineverse"),浏览器
// 就会把它们识别成同一个过渡目标,自动生成"从卡片位置/尺寸变形到面板
// 位置/尺寸"的动画——快照捕捉、插值计算、动画播放全部交给浏览器自己的
// 渲染管线,不需要我们手动读 getBoundingClientRect、算 translate/scale、
// 安排 forceReflow/rAF 时序。
//
// 之前几版手写实现踩过的坑,本质上都是"手动同步好几个时序敏感的步骤"
// 带来的(装饰数字被非均匀缩放压扁、内容交叉淡入淡出时序错位、reparent
// 和过渡撞在同一个同步任务里导致残留)——原生 API 把这些全部收进浏览器
// 自己的渲染管线,不再是我们能出错、也不再是我们需要控制的部分:
//   - 快照是浏览器对渲染结果拍的位图,插值只发生在 ::view-transition-
//     old/new 这两张图的容器盒子上,盒子内部的图片用 object-fit 保持
//     宽高比展示,内容本身永远不会被非均匀拉伸压扁。
//   - 内容切换(摘要 → 完整内容)只是"旧快照 vs 新快照"这一次性的差异,
//     不存在两层内容各自独立淡入淡出、必须互相错开时间点的编排问题。
//   - DOM 变化(面板插入/移除、卡片隐藏/恢复)在 startViewTransition 的
//     回调里同步完成,浏览器只在"变化前""变化后"分别拍照,不存在"变化
//     和过渡撞在同一个任务里"这回事——因为真正的过渡发生在浏览器另外
//     维护的一套快照动画上,和这次同步 DOM 变化本身是两件解耦的事。
//
// 不支持 View Transitions 的浏览器(document.startViewTransition 不
// 存在)会直接跳过动画,同步完成 DOM 切换,核心浏览功能不受影响(见
// supportsViewTransitions 分支)。

function initExpandInteractions() {
  const bentoGrid = document.getElementById("bento-grid");
  const backdrop = document.getElementById("expand-backdrop");
  if (!bentoGrid || !backdrop) return;

  let current = null; // { panel, card, moduleId } —— 当前展开的模块
  let previouslyFocused = null;
  let isAnimating = false; // 一次 view transition 正在播放期间,不能再开始下一次

  function supportsViewTransitions() {
    return typeof document.startViewTransition === "function";
  }

  function buildPanel(moduleId, builder) {
    const titleId = `overlay-title-${moduleId}`;
    const panel = document.createElement("div");
    panel.className = "overlay-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", titleId);
    panel.innerHTML = `
      <button type="button" class="overlay-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18"></path>
        </svg>
      </button>
      <div class="overlay-content">${builder(titleId)}</div>
    `;
    return panel;
  }

  // 展开后的目标 DOM 状态:卡片用 visibility:hidden 让出视觉呈现(同时
  // 退出可访问性树、不可聚焦、不接收指针事件,不需要额外单独处理这几
  // 件事);面板插入 body;背景整体降低存在感(这部分是普通 CSS 过渡,
  // 不参与 view transition 的具名快照,和上一版实现一样,原样保留)。
  function applyOpenState(card, panel) {
    card.classList.add("is-overlay-active");
    card.style.visibility = "hidden";

    document.body.appendChild(panel);

    bentoGrid.classList.add("has-overlay-open");
    bentoGrid.inert = true;
    document.body.style.overflow = "hidden";
    backdrop.classList.add("is-visible");
  }

  function applyClosedState(card, panel) {
    panel.remove();

    card.classList.remove("is-overlay-active");
    card.style.visibility = "";

    bentoGrid.classList.remove("has-overlay-open");
    bentoGrid.inert = false;
    document.body.style.overflow = "";
    backdrop.classList.remove("is-visible");
  }

  function expandCard(card) {
    if (current || isAnimating) return;
    const moduleId = card.dataset.expand;
    const builder = FULL_CONTENT_BUILDERS[moduleId];
    if (!builder) return;

    previouslyFocused = document.activeElement;
    const vtName = `card-${moduleId}`;
    const panel = buildPanel(moduleId, builder);

    // 降级路径:不支持 View Transitions 的环境,直接完成 DOM 切换,
    // 没有动画,但功能不受影响。
    if (!supportsViewTransitions()) {
      applyOpenState(card, panel);
      current = { panel, card, moduleId };
      afterOpen(panel);
      return;
    }

    isAnimating = true;
    // "旧"快照的持有者:卡片当前的样子。必须在 startViewTransition 之前
    // 设置,浏览器才能在启动过渡时立刻拍下这一帧。
    card.style.viewTransitionName = vtName;

    let transition;
    try {
      transition = document.startViewTransition(() => {
        card.style.viewTransitionName = ""; // 卡片让出这个名字
        applyOpenState(card, panel);
        panel.style.viewTransitionName = vtName; // 面板接过来,浏览器识别为同一个过渡目标
        current = { panel, card, moduleId };
        // 注意:startViewTransition 的回调不是同步执行的——规范把它排进
        // 一个 rendering task,要等到下一次渲染机会才真正跑,不是
        // startViewTransition() 一返回就已经跑完。所以"面板已经插入
        // DOM、可以安全聚焦关闭按钮"这件事只有在这个回调*内部*、DOM
        // 变化真正落地之后才成立,必须在这里调用 afterOpen,不能挪到
        // startViewTransition() 调用之后——那样 afterOpen 会在回调真正
        // 执行前就跑,对着还没插入文档的面板调用 .focus() 会静默失效。
        afterOpen(panel);
      });
    } catch (err) {
      // 极端情况(比如浏览器报告支持但实际抛错):照常完成切换,只是
      // 没有动画,不让交互卡住。
      card.style.viewTransitionName = "";
      applyOpenState(card, panel);
      current = { panel, card, moduleId };
      isAnimating = false;
      afterOpen(panel);
      return;
    }

    transition.finished.catch(() => {}).finally(() => {
      isAnimating = false;
    });
  }

  function afterOpen(panel) {
    document.addEventListener("keydown", onKeydown);
    panel.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    panel.querySelector(".overlay-close").focus();
  }

  function closeOverlay() {
    if (!current || isAnimating) return;
    const { panel, card, moduleId } = current;
    const vtName = `card-${moduleId}`;

    document.removeEventListener("keydown", onKeydown);

    if (!supportsViewTransitions()) {
      applyClosedState(card, panel);
      afterClose(card);
      return;
    }

    isAnimating = true;

    let transition;
    try {
      transition = document.startViewTransition(() => {
        panel.style.viewTransitionName = ""; // 面板让出("旧"快照它已经持有了)
        applyClosedState(card, panel);
        card.style.viewTransitionName = vtName; // 卡片接回来,反向播放同一段变形
        // 和 expandCard 里同样的原因:回调是异步排入渲染任务的,card
        // 恢复 visibility 这件事只有在这里(回调内部)才算真正生效,
        // afterClose 里的 card.focus() 必须紧跟在这之后调用,否则会对
        // 着此刻仍是 visibility:hidden 的卡片调用 focus(),同样会静默
        // 失效。
        afterClose(card);
      });
    } catch (err) {
      applyClosedState(card, panel);
      isAnimating = false;
      afterClose(card);
      return;
    }

    transition.finished.catch(() => {}).finally(() => {
      card.style.viewTransitionName = ""; // 清理,避免残留到下一次打开
      isAnimating = false;
    });
  }

  function afterClose(card) {
    if (document.contains(card)) {
      card.focus();
    } else if (previouslyFocused && document.contains(previouslyFocused)) {
      previouslyFocused.focus();
    }

    // 通知其它模块(比如手机端卡片堆叠)这张卡片已经收起,可以重新
    // 计算自己的布局了,不直接依赖这里的内部实现。
    card.dispatchEvent(new CustomEvent("bento:collapsed", { bubbles: true }));
    current = null;
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeOverlay();
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

  backdrop.addEventListener("click", closeOverlay);
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
// 卡片展开期间只做透明度淡出、不脱离堆叠(独立弹层架构,见
// initExpandInteractions),layoutStack 用 .is-overlay-active 跳过它,
// 避免堆叠自己的深度透明度覆盖掉展开机制设的 opacity:0。收起完成后
// render.js 会在 card 上派发 "bento:collapsed" 事件,这里监听它来
// 重新摆位一次,兜底任何边缘情况(比如键盘聚焦到了非最上层的卡片)。
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
    return stackEl.querySelector(`.bento-card.${moduleId}`) || document.querySelector(`.bento-card.${moduleId}`);
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
      if (!card || card === flyingCard || card.classList.contains("is-overlay-active")) return;
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
    if (card.classList.contains("is-overlay-active")) return;

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

// 本文件通过 <script src="render.js"> 加载,不使用 type="module":
// - 无构建工具,页面可能被直接以 file:// 打开做本地预览,ES module 在
//   file:// 下会触发浏览器 CORS 限制而加载失败,普通 script 没有这个问题。
// - content.js 用普通 script 先加载,顶层 const 声明的绑定在同一文档的
//   后续普通 script 间是共享可见的,不需要 import/export 就能拿到 content。
// script 标签放在 </body> 前、所有挂载点 DOM 已解析完毕之后执行,
// 因此不需要等待 DOMContentLoaded,直接调用即可。
renderPage();
