// render.js — 读取 content.js 的数据,渲染进 index.html 的挂载点,并管理
// 侧边栏收起/展开、tab 切换交互。普通 script(非 type="module"),原因见
// 文件末尾说明。当前只是渲染骨架:把"数据 → DOM"链路跑通,各板块内容
// 暂时简单占位,不做精细样式与完整交互(滚动淡入效果后续单独实现)。

const TAB_SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "project", label: "Project" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

// 侧边栏头像占位 + 联系方式图标:纯内联 SVG,不引入图标库/图片资源。
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

function renderSidebarAvatar() {
  const { avatar, name } = content.sidebar;
  if (avatar) {
    return `<img src="${avatar}" alt="${name}" />`;
  }
  return AVATAR_PLACEHOLDER_ICON;
}

function renderSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;
  const { name, role } = content.sidebar;
  const { email, linkedin, github } = content.contact;

  const contactLinks = [
    { type: "email", href: `mailto:${email}`, label: "Email", external: false },
    { type: "linkedin", href: linkedin, label: "LinkedIn", external: true },
    { type: "github", href: github, label: "GitHub", external: true },
  ];

  mount.innerHTML = `
    <div class="sidebar-avatar">${renderSidebarAvatar()}</div>
    <h1 class="sidebar-name">${name}</h1>
    <span class="sidebar-role eyebrow-badge">${role}</span>
    <ul class="sidebar-contacts">
      ${contactLinks
        .map(
          (c) => `
        <li>
          <a
            class="sidebar-contact-link"
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

// 移动端侧边栏收起为顶部区域:默认只显示姓名/职位定位 + 汉堡按钮,
// 点击后展开显示头像与联系方式图标(见 styles.css 对应媒体查询)。
function initSidebarToggle() {
  const toggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderTabNav() {
  const tabList = document.getElementById("tab-list");
  if (!tabList) return;

  tabList.innerHTML = TAB_SECTIONS.map(
    ({ id, label }) => `
    <li role="presentation">
      <button
        type="button"
        id="tab-${id}"
        class="tab-link"
        data-tab="${id}"
        role="tab"
        aria-selected="false"
        aria-controls="panel-${id}"
      >${label}</button>
    </li>
  `
  ).join("");
}

function setActiveTab(tabId) {
  document.querySelectorAll(".tab-link").forEach((button) => {
    const isActive = button.dataset.tab === tabId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tab === tabId);
  });
}

// tab 切换机制:显示/隐藏 DOM(.tab-panel.is-active 控制 display),
// 不是滚动锚点跳转,五个板块常驻 DOM 中,点击只切换可见性。
function initTabs() {
  const tabList = document.getElementById("tab-list");
  if (!tabList) return;

  tabList.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-link");
    if (!button) return;
    setActiveTab(button.dataset.tab);
  });

  setActiveTab(TAB_SECTIONS[0].id);
}

function renderAbout() {
  const mount = document.getElementById("about-mount");
  if (!mount) return;

  mount.innerHTML = `
    <h2 class="section-title">About</h2>
    ${content.about.paragraphs.map((p) => `<p>${p}</p>`).join("")}
  `;
}

function renderSkills() {
  const mount = document.getElementById("skills-mount");
  if (!mount) return;

  mount.innerHTML = `
    <h2 class="section-title">Skills</h2>
    <div class="skills-grid">
      ${content.skills.categories
        .map(
          (category) => `
        <div class="card skills-category">
          <h3>${category.title}</h3>
          <ul class="stack-tags">${category.items.map((item) => `<li class="stack-tag">${item}</li>`).join("")}</ul>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderProject() {
  const mount = document.getElementById("project-mount");
  if (!mount) return;
  const { name, description, stack, githubUrl, highlights } = content.project;

  mount.innerHTML = `
    <h2 class="section-title">Project — ${name}</h2>
    <p>${description}</p>
    <ul class="stack-tags">
      ${stack.map((tech) => `<li class="stack-tag">${tech}</li>`).join("")}
    </ul>
    <div class="project-cta">
      <a class="btn-pill" href="${githubUrl}" target="_blank" rel="noopener">View on GitHub</a>
    </div>
    <div class="highlights-grid">
      ${highlights
        .map(
          (h, index) => `
        <div class="card highlight-card">
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

function renderExperience() {
  const mount = document.getElementById("experience-mount");
  if (!mount) return;

  mount.innerHTML = `
    <h2 class="section-title">Experience</h2>
    ${content.experience.positions
      .map(
        (p) => `
      <div class="experience-item">
        <h3>${p.company}</h3>
        <p class="experience-role">${p.role} · ${p.period}</p>
        <p>${p.summary}</p>
      </div>
    `
      )
      .join("")}
  `;
}

function renderContact() {
  const mount = document.getElementById("contact-mount");
  if (!mount) return;
  const { email, linkedin, github } = content.contact;

  mount.innerHTML = `
    <h2 class="section-title">Contact</h2>
    <div class="contact-actions">
      <a class="btn-pill" href="mailto:${email}">Email</a>
      <a class="btn-pill btn-pill-outline" href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn-pill btn-pill-outline" href="${github}" target="_blank" rel="noopener">GitHub</a>
    </div>
  `;
}

function renderPage() {
  renderSidebar();
  initSidebarToggle();
  renderTabNav();
  renderAbout();
  renderSkills();
  renderProject();
  renderExperience();
  renderContact();
  initTabs();
}

// 本文件通过 <script src="render.js"> 加载,不使用 type="module":
// - 无构建工具,页面可能被直接以 file:// 打开做本地预览,ES module 在
//   file:// 下会触发浏览器 CORS 限制而加载失败,普通 script 没有这个问题。
// - content.js 用普通 script 先加载,顶层 const 声明的绑定在同一文档的
//   后续普通 script 间是共享可见的,不需要 import/export 就能拿到 content。
// script 标签放在 </body> 前、所有挂载点 DOM 已解析完毕之后执行,
// 因此不需要等待 DOMContentLoaded,直接调用即可。
renderPage();
