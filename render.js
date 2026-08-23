/**
 * Injects CONTENT into the DOM and wires up every interaction.
 * Nothing in here hardcodes copy — all text comes from content.js.
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let lenisInstance = null;

  function safe(fn) {
    try { fn(); } catch (err) { console.error(err); }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function navHeightPx() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 64;
  }

  function smoothScrollTo(target, offset) {
    const resolvedOffset = offset !== undefined ? offset : (typeof target === "number" ? 0 : -(navHeightPx() + 16));
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { offset: resolvedOffset, duration: prefersReducedMotion ? 0 : 1.2 });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: prefersReducedMotion ? "auto" : "smooth" });
    } else {
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  /* ============================================================
     Render content.js -> DOM
     ============================================================ */
  function renderContent() {
    document.title = `${CONTENT.site.name} — ${CONTENT.site.role}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", `Portfolio of ${CONTENT.site.name}, ${CONTENT.site.role}.`);

    document.getElementById("nav-logo").textContent = CONTENT.site.monogram;
    renderNavLinks();

    document.querySelector('[data-hook="hero-greeting"]').textContent = CONTENT.hero.greeting;
    renderHeroName();
    document.querySelector('[data-hook="hero-tagline"]').textContent = CONTENT.hero.tagline;
    const heroCta = document.getElementById("hero-cta");
    heroCta.textContent = CONTENT.hero.cta.label;
    heroCta.setAttribute("href", "#" + CONTENT.hero.cta.target);
    heroCta.dataset.target = CONTENT.hero.cta.target;

    renderCineverse();

    document.querySelector('[data-hook="about-heading"]').textContent = CONTENT.about.heading;
    document.querySelector('[data-hook="about-body"]').innerHTML =
      CONTENT.about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");

    document.querySelector('[data-hook="skills-heading"]').textContent = CONTENT.skills.heading;
    document.querySelector('[data-hook="skills-body"]').innerHTML = CONTENT.skills.groups
      .map(
        (g) => `
        <div class="skills-group">
          <p class="skills-group__label">${escapeHtml(g.label)}</p>
          <div class="skills-tags">${g.items.map((i) => `<span class="skill-tag">${escapeHtml(i)}</span>`).join("")}</div>
        </div>`
      )
      .join("");

    document.querySelector('[data-hook="experience-heading"]').textContent = CONTENT.experience.heading;
    document.querySelector('[data-hook="experience-body"]').innerHTML = CONTENT.experience.items
      .map(
        (item) => `
        <div class="xp-item">
          <div class="xp-item__top">
            <div>
              <div class="xp-item__role">${escapeHtml(item.role)}</div>
              <div class="xp-item__org">${escapeHtml(item.org)}</div>
            </div>
            <div class="xp-item__period">${escapeHtml(item.period)}</div>
          </div>
          <ul class="xp-item__bullets">${item.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
        </div>`
      )
      .join("");

    document.querySelector('[data-hook="contact-heading"]').textContent = CONTENT.contact.heading;
    document.querySelector('[data-hook="contact-body"]').innerHTML = `
      <p>${escapeHtml(CONTENT.contact.body)}</p>
      <a class="btn btn--primary btn-magnetic" href="${escapeHtml(CONTENT.contact.cta.href)}">${escapeHtml(CONTENT.contact.cta.label)}</a>
      <div class="contact-socials">
        <a class="contact-social-link" href="mailto:${escapeHtml(CONTENT.contact.email)}">${escapeHtml(CONTENT.contact.email)}</a>
        ${CONTENT.contact.socials
          .map((s) => `<a class="contact-social-link" href="${escapeHtml(s.href)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`)
          .join("")}
      </div>`;

    renderGithubCard();

    const footerText = document.querySelector('[data-hook="footer-text"]');
    if (footerText) footerText.textContent = `© ${new Date().getFullYear()} ${CONTENT.site.name}. Built with vanilla JS, GSAP & Lenis.`;
  }

  function renderNavLinks() {
    const itemsHtml = CONTENT.nav
      .map((item) => `<li><a href="#${item.target}" data-target="${item.target}">${escapeHtml(item.label)}</a></li>`)
      .join("");
    document.getElementById("nav-links").innerHTML = itemsHtml;
    document.getElementById("mobile-nav-links").innerHTML = itemsHtml;
  }

  function renderHeroName() {
    const nameEl = document.getElementById("hero-name");
    const frag = document.createDocumentFragment();
    for (const ch of CONTENT.hero.name) {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(span);
    }
    nameEl.innerHTML = "";
    nameEl.appendChild(frag);
  }

  function highlightJavaLine(rawLine) {
    if (!rawLine) return "";
    const KEYWORDS = new Set(["public", "private", "protected", "class", "final", "static", "void", "return", "if", "else", "new", "this", "boolean"]);
    const tokenRe = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+\b)|([A-Za-z_]\w*)|([{}()[\];.,+=])/g;
    let out = "";
    let last = 0;
    let m;
    while ((m = tokenRe.exec(rawLine))) {
      out += escapeHtml(rawLine.slice(last, m.index));
      const word = m[0];
      if (m[1]) out += `<span class="tok-com">${escapeHtml(word)}</span>`;
      else if (m[2]) out += `<span class="tok-str">${escapeHtml(word)}</span>`;
      else if (m[3]) out += `<span class="tok-num">${escapeHtml(word)}</span>`;
      else if (m[4]) {
        if (KEYWORDS.has(word)) out += `<span class="tok-kw">${escapeHtml(word)}</span>`;
        else if (/^[A-Z]/.test(word)) out += `<span class="tok-type">${escapeHtml(word)}</span>`;
        else if (rawLine[tokenRe.lastIndex] === "(") out += `<span class="tok-fn">${escapeHtml(word)}</span>`;
        else out += `<span class="tok-plain">${escapeHtml(word)}</span>`;
      } else {
        out += `<span class="tok-punct">${escapeHtml(word)}</span>`;
      }
      last = tokenRe.lastIndex;
    }
    out += escapeHtml(rawLine.slice(last));
    return out;
  }

  function renderTreeNode(node) {
    const li = document.createElement("li");
    li.className = node.type === "folder" ? "cv-tree__folder" : "cv-tree__file";
    if (node.current) li.classList.add("is-current");
    const label = document.createElement("span");
    label.textContent = node.name;
    li.appendChild(label);
    if (node.children && node.children.length) {
      const ul = document.createElement("ul");
      node.children.forEach((child) => ul.appendChild(renderTreeNode(child)));
      li.appendChild(ul);
    }
    return li;
  }

  function renderCineverse() {
    const c = CONTENT.cineverse;
    document.querySelector('[data-hook="cv-label"]').textContent = c.label;
    document.querySelector('[data-hook="cv-title"]').textContent = c.title;
    document.querySelector('[data-hook="cv-subtitle"]').textContent = c.subtitle;
    document.querySelector('[data-hook="cv-tags"]').innerHTML = c.tags.map((t) => `<span class="cv-tag">${escapeHtml(t)}</span>`).join("");

    document.querySelector('[data-hook="cv-code-filename"]').textContent = c.code.filename;
    document.querySelector('[data-hook="cv-code-pills"]').innerHTML = `
      <span class="cv-code__pill">${escapeHtml(c.code.language)}</span>
      <span class="cv-code__pill">${escapeHtml(c.code.badge)}</span>`;
    document.querySelector('[data-hook="cv-code-lines"]').innerHTML = c.code.lines.map(highlightJavaLine).join("\n");

    document.querySelector('[data-hook="cv-lock-requests"]').innerHTML = c.lockDemo.requests
      .map(
        (r) => `
        <div class="cv-request" data-request="${r.id}">
          <span class="cv-request__label">${escapeHtml(r.label)}</span>
          <span class="cv-request__status">${escapeHtml(c.lockDemo.idleText)}</span>
        </div>`
      )
      .join("");
    document.querySelector('[data-hook="cv-lock-key"]').textContent = c.lockDemo.caption;

    const githubLink = document.querySelector('[data-hook="cv-github-link"]');
    githubLink.textContent = c.githubLabel;
    githubLink.href = c.githubUrl;

    document.querySelector('[data-hook="cv-expand-hint"]').textContent = c.expandHint;

    document.querySelector('[data-hook="cv-overlay-title"]').textContent = c.title;
    document.querySelector('[data-hook="cv-tree"]').appendChild(renderTreeNode(c.fileTree));
    document.querySelector('[data-hook="cv-decisions"]').innerHTML = c.decisions
      .map(
        (d) => `
        <div class="cv-decision">
          <p class="cv-decision__title">${escapeHtml(d.title)}</p>
          <p class="cv-decision__body">${escapeHtml(d.body)}</p>
        </div>`
      )
      .join("");
  }

  /* ---- GitHub activity: seeded placeholder data ---- */
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generateHeatmap(weeks) {
    const rand = mulberry32(20260823);
    const counts = [];
    let momentum = 0;
    for (let i = 0; i < weeks * 7; i++) {
      const dow = i % 7;
      const weekendDamp = dow === 0 || dow === 6 ? 0.55 : 1;
      momentum = momentum * 0.7 + (rand() - 0.32) * 0.6;
      let count = Math.round(Math.max(0, rand() * 4 + momentum * 3) * weekendDamp);
      if (rand() < 0.1) count = 0;
      counts.push(count);
    }
    return counts;
  }

  function levelForCount(count) {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 7) return 3;
    return 4;
  }

  function computeStreak(counts) {
    let streak = 0;
    for (let i = counts.length - 1; i >= 0; i--) {
      if (counts[i] > 0) streak++;
      else break;
    }
    return streak;
  }

  function languageColor(name, languages) {
    const found = languages.find((l) => l.name === name);
    return found ? found.color : "var(--text-secondary)";
  }

  function renderGithubCard() {
    const g = CONTENT.github;
    const usernameLink = document.querySelector('[data-hook="gh-username"]');
    usernameLink.textContent = "@" + g.username;
    usernameLink.href = "https://github.com/" + g.username;

    const heatmapCounts = generateHeatmap(g.heatmapWeeks);
    const contributions = heatmapCounts.reduce((sum, n) => sum + n, 0);
    const streak = computeStreak(heatmapCounts);

    const stats = [
      { value: g.stats.repos, label: "Repositories" },
      { value: g.stats.stars, label: "CineVerse stars" },
      { value: streak, label: g.stats.streakLabel },
      { value: contributions, label: g.stats.yearLabel },
    ];
    document.querySelector('[data-hook="gh-stats"]').innerHTML = stats
      .map(
        (s) => `
        <div class="gh__stat">
          <span class="gh__stat-value" data-count-to="${s.value}">${s.value}</span>
          <p class="gh__stat-label">${escapeHtml(s.label)}</p>
        </div>`
      )
      .join("");

    const heatmapWrap = document.querySelector('[data-hook="gh-heatmap"]');
    heatmapWrap.innerHTML = "";
    const frag = document.createDocumentFragment();
    const today = new Date();
    for (let i = 0; i < heatmapCounts.length; i++) {
      const count = heatmapCounts[i];
      const daysAgo = heatmapCounts.length - 1 - i;
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const cell = document.createElement("div");
      cell.className = "gh__heatmap-cell";
      cell.dataset.level = String(levelForCount(count));
      const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      cell.title = `${count} contribution${count === 1 ? "" : "s"} on ${dateLabel}`;
      frag.appendChild(cell);
    }
    heatmapWrap.appendChild(frag);

    const bar = g.languages.map((l) => `<span class="gh__lang-segment" style="width:${l.percent}%;background:${l.color}"></span>`).join("");
    const legend = g.languages
      .map((l) => `<span class="gh__lang-legend-item"><span class="gh__lang-swatch" style="background:${l.color}"></span>${escapeHtml(l.name)} · ${l.percent}%</span>`)
      .join("");
    document.querySelector('[data-hook="gh-languages"]').innerHTML = `<div class="gh__lang-bar">${bar}</div><div class="gh__lang-legend">${legend}</div>`;

    const p = g.pinnedRepo;
    document.querySelector('[data-hook="gh-pinned"]').innerHTML = `
      <a class="gh__pinned-card" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">
        <div class="gh__pinned-name">📌 ${escapeHtml(p.name)}</div>
        <p class="gh__pinned-desc">${escapeHtml(p.description)}</p>
        <div class="gh__pinned-meta">
          <span><span class="gh__pinned-lang-dot" style="background:${languageColor(p.language, g.languages)}"></span>${escapeHtml(p.language)}</span>
          <span>★ ${p.stars}</span>
        </div>
      </a>`;
  }

  /* ============================================================
     Smooth scroll (Lenis + GSAP ticker)
     ============================================================ */
  function initLenis() {
    if (typeof Lenis === "undefined") return;
    lenisInstance = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.1,
      smoothWheel: !prefersReducedMotion,
    });
    lenisInstance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ============================================================
     Nav — liquid glass + hamburger
     ============================================================ */
  function initNav() {
    const nav = document.getElementById("nav");
    const sentinel = document.getElementById("hero-sentinel");

    const io = new IntersectionObserver(
      ([entry]) => nav.classList.toggle("nav--scrolled", !entry.isIntersecting),
      { rootMargin: `-${navHeightPx()}px 0px 0px 0px`, threshold: 0 }
    );
    io.observe(sentinel);

    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");

    function closeMobileMenu() {
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
    }
    function toggleMobileMenu() {
      const isOpen = mobileMenu.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    }
    hamburger.addEventListener("click", toggleMobileMenu);

    document.getElementById("nav-logo").addEventListener("click", () => smoothScrollTo(0));

    document.querySelectorAll(".nav__links a, .nav__mobile-menu a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const targetEl = document.getElementById(a.dataset.target);
        if (targetEl) smoothScrollTo(targetEl);
        closeMobileMenu();
      });
    });

    document.getElementById("mobile-cmdk-trigger").addEventListener("click", () => {
      closeMobileMenu();
      openCmdk();
    });

    document.getElementById("hero-cta").addEventListener("click", (e) => {
      e.preventDefault();
      const targetEl = document.getElementById(e.currentTarget.dataset.target);
      if (targetEl) smoothScrollTo(targetEl);
    });
  }

  /* ============================================================
     Command palette
     ============================================================ */
  const cmdkState = { filtered: [], selectedIndex: 0 };

  function fuzzyMatch(query, target) {
    if (!query) return { match: true, score: 0 };
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    let qi = 0;
    let score = 0;
    let lastMatchIndex = -1;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) {
        score += lastMatchIndex === ti - 1 ? 3 : 1;
        lastMatchIndex = ti;
        qi++;
      }
    }
    return { match: qi === q.length, score };
  }

  function openCmdk() {
    const cmdk = document.getElementById("cmdk");
    cmdk.classList.add("is-open");
    cmdk.setAttribute("aria-hidden", "false");
    const input = document.getElementById("cmdk-input");
    input.value = "";
    filterCmdk("");
    requestAnimationFrame(() => input.focus());
    document.body.style.overflow = "hidden";
  }

  function closeCmdk() {
    const cmdk = document.getElementById("cmdk");
    cmdk.classList.remove("is-open");
    cmdk.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function filterCmdk(query) {
    const list = document.getElementById("cmdk-list");
    const scored = CONTENT.commands
      .map((cmd) => ({ cmd, ...fuzzyMatch(query, cmd.label) }))
      .filter((x) => x.match)
      .sort((a, b) => b.score - a.score);

    cmdkState.filtered = scored.map((x) => x.cmd);
    cmdkState.selectedIndex = 0;

    if (!scored.length) {
      list.innerHTML = '<li class="cmdk__empty">No results</li>';
      return;
    }

    let html = "";
    let lastGroup = null;
    scored.forEach((x, i) => {
      if (x.cmd.group !== lastGroup) {
        html += `<li class="cmdk__group-label">${escapeHtml(x.cmd.group)}</li>`;
        lastGroup = x.cmd.group;
      }
      html += `<li class="cmdk__item${i === 0 ? " is-selected" : ""}" role="option" data-index="${i}">
        <span class="cmdk__item-label">${escapeHtml(x.cmd.label)}</span>
        <span class="cmdk__item-arrow">↵</span>
      </li>`;
    });
    list.innerHTML = html;
  }

  function moveCmdkSelection(delta) {
    const items = document.querySelectorAll("#cmdk-list .cmdk__item");
    if (!items.length) return;
    items[cmdkState.selectedIndex] && items[cmdkState.selectedIndex].classList.remove("is-selected");
    cmdkState.selectedIndex = (cmdkState.selectedIndex + delta + items.length) % items.length;
    const activeItem = items[cmdkState.selectedIndex];
    activeItem.classList.add("is-selected");
    activeItem.scrollIntoView({ block: "nearest" });
  }

  function executeCommand(cmd) {
    if (!cmd) return;
    closeCmdk();
    if (cmd.action === "scroll") {
      const targetEl = document.getElementById(cmd.target);
      if (targetEl) smoothScrollTo(targetEl);
    } else if (cmd.action === "link") {
      if (cmd.target && cmd.target !== "#") window.open(cmd.target, "_blank", "noopener");
    } else if (cmd.action === "mailto") {
      window.location.href = "mailto:" + cmd.target;
    }
  }

  function initCommandPalette() {
    const trigger = document.getElementById("cmdk-trigger");
    const backdrop = document.getElementById("cmdk-backdrop");
    const input = document.getElementById("cmdk-input");
    const list = document.getElementById("cmdk-list");

    trigger.addEventListener("click", openCmdk);
    backdrop.addEventListener("click", closeCmdk);

    document.addEventListener("keydown", (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const cmdk = document.getElementById("cmdk");
      if (isCmdK) {
        e.preventDefault();
        cmdk.classList.contains("is-open") ? closeCmdk() : openCmdk();
        return;
      }
      if (!cmdk.classList.contains("is-open")) return;
      if (e.key === "Escape") closeCmdk();
      else if (e.key === "ArrowDown") { e.preventDefault(); moveCmdkSelection(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); moveCmdkSelection(-1); }
      else if (e.key === "Enter") { e.preventDefault(); executeCommand(cmdkState.filtered[cmdkState.selectedIndex]); }
    });

    input.addEventListener("input", () => filterCmdk(input.value));

    list.addEventListener("click", (e) => {
      const item = e.target.closest(".cmdk__item");
      if (!item) return;
      executeCommand(cmdkState.filtered[Number(item.dataset.index)]);
    });

    list.addEventListener("mousemove", (e) => {
      const item = e.target.closest(".cmdk__item");
      if (!item || item.dataset.index === undefined) return;
      const index = Number(item.dataset.index);
      if (index === cmdkState.selectedIndex) return;
      document.querySelectorAll("#cmdk-list .cmdk__item").forEach((i) => i.classList.remove("is-selected"));
      item.classList.add("is-selected");
      cmdkState.selectedIndex = index;
    });
  }

  /* ============================================================
     Hero — kinetic title + spotlight
     ============================================================ */
  function initHeroAnimation() {
    const heroCard = document.getElementById("hero");
    const chars = heroCard.querySelectorAll(".hero__name .char");

    if (prefersReducedMotion) {
      gsap.set(chars, { opacity: 1, y: 0 });
    } else {
      gsap.set(chars, { opacity: 0, y: 26 });
      gsap.timeline({ delay: 0.2 }).to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.035,
      });
    }

    if (canHover) {
      const spotlight = document.getElementById("hero-spotlight");
      heroCard.addEventListener("mousemove", (e) => {
        const rect = heroCard.getBoundingClientRect();
        spotlight.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        spotlight.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    }
  }

  /* ============================================================
     Magnetic buttons (primary CTAs only)
     ============================================================ */
  function initMagneticButtons() {
    if (!canHover || prefersReducedMotion) return;
    document.querySelectorAll(".btn-magnetic").forEach((btn) => {
      // Two quickTo()s writing directly to the same element's x/y both touch
      // its transform; GSAP's fast setters can clobber each other. Proxy
      // through a plain object and apply both via one gsap.set instead.
      const state = { x: 0, y: 0 };
      const apply = () => gsap.set(btn, { x: state.x, y: state.y });
      const moveX = gsap.quickTo(state, "x", { duration: 0.5, ease: "power3.out", onUpdate: apply });
      const moveY = gsap.quickTo(state, "y", { duration: 0.5, ease: "power3.out", onUpdate: apply });
      const strength = 0.4;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        moveX((e.clientX - rect.left - rect.width / 2) * strength);
        moveY((e.clientY - rect.top - rect.height / 2) * strength);
      });
      btn.addEventListener("mouseleave", () => { moveX(0); moveY(0); });
    });
  }

  /* ============================================================
     CineVerse — 3D tilt + glare
     ============================================================ */
  function initCineverseTilt() {
    if (!canHover || prefersReducedMotion) return;
    const card = document.getElementById("cineverse");
    const glare = card.querySelector(".cv-glare");
    // Same clobbering issue as the magnetic buttons: drive rotateX/rotateY
    // through a proxy object and commit both together via one gsap.set.
    const state = { rx: 0, ry: 0 };
    const apply = () => gsap.set(card, { rotateX: state.rx, rotateY: state.ry });
    const setRX = gsap.quickTo(state, "rx", { duration: 0.5, ease: "power2.out", onUpdate: apply });
    const setRY = gsap.quickTo(state, "ry", { duration: 0.5, ease: "power2.out", onUpdate: apply });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setRY((px - 0.5) * 10);
      setRX(-(py - 0.5) * 10);
      if (glare) {
        glare.style.setProperty("--gx", `${px * 100}%`);
        glare.style.setProperty("--gy", `${py * 100}%`);
      }
    });
    card.addEventListener("mouseleave", () => { setRX(0); setRY(0); });
  }

  /* ============================================================
     CineVerse — scroll-triggered concurrent lock simulation
     ============================================================ */
  function initCineverseLockDemo() {
    if (prefersReducedMotion) return;
    const card = document.getElementById("cineverse");
    const requests = card.querySelectorAll(".cv-request");
    const lockIcon = document.getElementById("cv-lock-icon");
    if (!requests.length) return;

    let active = false;
    let inView = false;
    let timeoutId = null;

    function resetVisual() {
      requests.forEach((r) => {
        r.classList.remove("is-locked", "is-blocked");
        r.querySelector(".cv-request__status").textContent = CONTENT.cineverse.lockDemo.idleText;
      });
      lockIcon.classList.remove("is-locked");
    }

    function cycle() {
      if (!inView || active) return;
      active = true;
      const winner = Math.floor(Math.random() * requests.length);
      gsap
        .timeline({
          onComplete: () => {
            active = false;
            if (inView) timeoutId = setTimeout(cycle, 1000);
          },
        })
        .to(requests, { scale: 1.04, duration: 0.22, stagger: 0.05, ease: "power1.out" })
        .to(requests, { scale: 1, duration: 0.18 })
        .add(() => {
          requests.forEach((r, i) => {
            const isWinner = i === winner;
            r.classList.add(isWinner ? "is-locked" : "is-blocked");
            r.querySelector(".cv-request__status").textContent = isWinner
              ? CONTENT.cineverse.lockDemo.lockedText
              : CONTENT.cineverse.lockDemo.blockedText;
          });
          lockIcon.classList.add("is-locked");
        })
        .to({}, { duration: 1.7 })
        .add(resetVisual)
        .to({}, { duration: 0.35 });
    }

    ScrollTrigger.create({
      trigger: card,
      start: "top 75%",
      end: "bottom top",
      onEnter: () => { inView = true; cycle(); },
      onEnterBack: () => { inView = true; cycle(); },
      onLeave: () => { inView = false; clearTimeout(timeoutId); },
      onLeaveBack: () => { inView = false; clearTimeout(timeoutId); },
    });
  }

  /* ============================================================
     CineVerse — expand via View Transitions API
     ============================================================ */
  function initCineverseExpand() {
    const card = document.getElementById("cineverse");
    const overlay = document.getElementById("cv-overlay");
    const panel = overlay.querySelector(".cv-overlay__panel");
    const closeBtn = document.getElementById("cv-overlay-close");
    let lastFocused = null;

    card.style.viewTransitionName = "cv-card-morph";

    function runTransition(fn) {
      if (document.startViewTransition && !prefersReducedMotion) document.startViewTransition(fn);
      else fn();
    }

    function openOverlay() {
      lastFocused = document.activeElement;
      runTransition(() => {
        card.style.viewTransitionName = "none";
        panel.style.viewTransitionName = "cv-card-morph";
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
      setTimeout(() => closeBtn.focus(), prefersReducedMotion ? 0 : 400);
    }

    function closeOverlay() {
      runTransition(() => {
        panel.style.viewTransitionName = "none";
        card.style.viewTransitionName = "cv-card-morph";
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
      if (lastFocused) lastFocused.focus();
    }

    card.addEventListener("click", (e) => {
      if (e.target.closest("a, .cv-code, .cv-lock-demo")) return;
      openOverlay();
    });
    closeBtn.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeOverlay(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeOverlay();
    });
  }

  /* ============================================================
     CineVerse — scoped custom cursor
     ============================================================ */
  function initCineverseCursor() {
    if (!canHover) return;
    const card = document.getElementById("cineverse");
    const cursor = document.getElementById("cv-cursor");
    const expandZone = card.querySelector(".cv-expand-hint");

    card.addEventListener("mouseenter", () => {
      cursor.classList.add("is-active");
      card.classList.add("cv-cursor-active");
    });
    card.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-active", "is-expand");
      card.classList.remove("cv-cursor-active");
    });
    card.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
    if (expandZone) {
      expandZone.addEventListener("mouseenter", () => cursor.classList.add("is-expand"));
      expandZone.addEventListener("mouseleave", () => cursor.classList.remove("is-expand"));
    }
  }

  /* ============================================================
     GitHub card — count-up stats, gated by ScrollTrigger
     ============================================================ */
  function initStatCountUps() {
    const statsEls = document.querySelectorAll(".gh__stat-value[data-count-to]");
    if (!statsEls.length) return;

    function run() {
      statsEls.forEach((elm) => {
        const target = Number(elm.dataset.countTo) || 0;
        if (prefersReducedMotion) { elm.textContent = target; return; }
        elm.textContent = "0";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => { elm.textContent = Math.round(obj.val); },
        });
      });
    }

    ScrollTrigger.create({
      trigger: document.getElementById("github"),
      start: "top 85%",
      once: true,
      onEnter: run,
    });
  }

  /* ============================================================
     Generic scroll-reveal for bento cards (excludes hero, which
     has its own kinetic entrance)
     ============================================================ */
  function initScrollReveals() {
    if (prefersReducedMotion) return;
    const items = [
      document.querySelector(".cv-tilt-wrap"),
      document.getElementById("about"),
      document.getElementById("skills"),
      document.getElementById("experience"),
      document.getElementById("contact"),
      document.getElementById("github"),
    ].filter(Boolean);

    items.forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        delay: (i % 4) * 0.05,
        scrollTrigger: { trigger: item, start: "top 88%", once: true },
      });
    });
  }

  /* ============================================================
     Terminal easter egg
     ============================================================ */
  function initTerminalEasterEgg() {
    const toggle = document.getElementById("terminal-toggle");
    const win = document.getElementById("terminal-window");
    const closeBtn = document.getElementById("terminal-close");
    const output = document.getElementById("terminal-output");
    const input = document.getElementById("terminal-input");

    const COMMANDS = {
      help: () =>
        ["Available commands:", "  help       show this list", "  about      who built this site", "  whoami     guest session info", "  cineverse  jump to the CineVerse card", "  clear      clear the terminal"].join("\n"),
      about: () => `Built by ${CONTENT.site.name} with vanilla HTML/CSS/JS, GSAP and Lenis. No frameworks, no build step.`,
      whoami: () => "guest@portfolio — read-only session, be nice.",
      cineverse: () => {
        const target = document.getElementById("cineverse");
        if (target) smoothScrollTo(target);
        return "Scrolling to CineVerse…";
      },
      clear: () => { output.innerHTML = ""; return null; },
    };

    function printLine(text, isCmd) {
      const line = document.createElement("div");
      if (isCmd) line.className = "is-cmd";
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }

    function openTerminal() {
      win.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (!output.childElementCount) printLine('Type "help" to see available commands.');
      requestAnimationFrame(() => input.focus());
    }
    function closeTerminal() {
      win.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => (win.classList.contains("is-open") ? closeTerminal() : openTerminal()));
    closeBtn.addEventListener("click", closeTerminal);

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const raw = input.value.trim();
      input.value = "";
      if (!raw) return;
      printLine(raw, true);
      const handler = COMMANDS[raw.toLowerCase()];
      const result = handler ? handler() : `command not found: ${raw}`;
      if (result) printLine(result);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && win.classList.contains("is-open")) closeTerminal();
    });
  }

  function initPlaceholderLinkGuards() {
    document.querySelectorAll('a[href="#"]').forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
  }

  /* ============================================================
     Bootstrap
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    safe(() => { if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); });

    safe(renderContent);

    safe(initLenis);
    safe(initNav);
    safe(initCommandPalette);
    safe(initHeroAnimation);
    safe(initMagneticButtons);
    safe(initCineverseTilt);
    safe(initCineverseLockDemo);
    safe(initCineverseExpand);
    safe(initCineverseCursor);
    safe(initStatCountUps);
    safe(initScrollReveals);
    safe(initTerminalEasterEgg);
    safe(initPlaceholderLinkGuards);

    safe(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => safe(() => window.ScrollTrigger && ScrollTrigger.refresh()));
    }
  });
})();
