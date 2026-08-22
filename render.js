// render.js — 读取 content.js 的数据,渲染进 index.html 的 bento 网格挂载点。
// 普通 script(非 type="module"),原因见文件末尾说明。本轮只实现骨架:
// 把"数据 → DOM"链路跑通,按 CLAUDE.md「页面结构」把七个模块渲染到对应
// 网格位置。点击展开为居中弹层的交互(软弹动画)留待下一轮单独实现。

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

function renderPage() {
  renderIdentity();
  renderProjectCard();
  renderTechStack();
  renderStats();
  renderSkillsCard();
  renderExperienceCard();
  renderContactCard();
}

// 本文件通过 <script src="render.js"> 加载,不使用 type="module":
// - 无构建工具,页面可能被直接以 file:// 打开做本地预览,ES module 在
//   file:// 下会触发浏览器 CORS 限制而加载失败,普通 script 没有这个问题。
// - content.js 用普通 script 先加载,顶层 const 声明的绑定在同一文档的
//   后续普通 script 间是共享可见的,不需要 import/export 就能拿到 content。
// script 标签放在 </body> 前、所有挂载点 DOM 已解析完毕之后执行,
// 因此不需要等待 DOMContentLoaded,直接调用即可。
renderPage();
