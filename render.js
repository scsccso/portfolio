// render.js — 读取 content.js 的数据,渲染进 index.html 的挂载点。
// 普通 script(非 type="module"),原因见本文件末尾 IIFE 之前的说明。
// 当前只是渲染骨架:把"数据 → DOM"链路跑通,不做精细样式与完整交互。

const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "project", label: "Project" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function renderNav() {
  const navBrand = document.getElementById("nav-brand-mount");
  const navList = document.getElementById("nav-links");
  if (!navBrand || !navList) return;

  navBrand.textContent = content.hero.name;

  navList.innerHTML = "";
  NAV_SECTIONS.forEach(({ id, label }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = label;
    li.appendChild(a);
    navList.appendChild(li);
  });
}

function initMobileNavToggle() {
  // TODO: 汉堡菜单展开/收起交互逻辑,后续单独实现。
  // 本次先留出容器结构(#nav-toggle 按钮 + #nav-links 列表),不接完整行为。
}

function renderHero() {
  const mount = document.getElementById("hero-mount");
  if (!mount) return;
  const { name, role, tagline, cta } = content.hero;

  mount.innerHTML = `
    <h1>${name}</h1>
    <p class="hero-role">${role}</p>
    <p class="hero-tagline">${tagline}</p>
    <a class="cta-button" href="${cta.href}">${cta.label}</a>
  `;
}

function renderAbout() {
  const mount = document.getElementById("about-mount");
  if (!mount) return;

  mount.innerHTML = `
    <h2>About</h2>
    ${content.about.paragraphs.map((p) => `<p>${p}</p>`).join("")}
  `;
}

function renderSkills() {
  const mount = document.getElementById("skills-mount");
  if (!mount) return;

  mount.innerHTML = `
    <h2>Skills</h2>
    <div class="skills-grid">
      ${content.skills.categories
        .map(
          (category) => `
        <div class="skills-category">
          <h3>${category.title}</h3>
          <ul>${category.items.map((item) => `<li>${item}</li>`).join("")}</ul>
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
    <h2 class="section-title">Featured Project — ${name}</h2>
    <p class="project-description">${description}</p>
    <ul class="stack-tags">
      ${stack.map((tech) => `<li class="stack-tag">${tech}</li>`).join("")}
    </ul>
    <a class="btn-pill" href="${githubUrl}" target="_blank" rel="noopener">GitHub</a>
    <div class="highlights-grid">
      ${highlights
        .map(
          (h, index) => `
        <div class="highlight-card">
          <span class="highlight-card-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
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
    <h2>Work Experience</h2>
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
    <h2>Contact</h2>
    <div class="contact-links">
      <a href="mailto:${email}">${email}</a>
      <a href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${github}" target="_blank" rel="noopener">GitHub</a>
    </div>
  `;
}

function renderPage() {
  renderNav();
  initMobileNavToggle();
  renderHero();
  renderAbout();
  renderSkills();
  renderProject();
  renderExperience();
  renderContact();
}

// 本文件通过 <script src="render.js"> 加载,不使用 type="module":
// - 无构建工具,页面可能被直接以 file:// 打开做本地预览,ES module 在
//   file:// 下会触发浏览器 CORS 限制而加载失败,普通 script 没有这个问题。
// - content.js 用普通 script 先加载,顶层 const 声明的绑定在同一文档的
//   后续普通 script 间是共享可见的,不需要 import/export 就能拿到 content。
// script 标签放在 </body> 前、所有挂载点 DOM 已解析完毕之后执行,
// 因此不需要等待 DOMContentLoaded,直接调用即可。
renderPage();
