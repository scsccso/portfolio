// sample-full-page.js — 仅供 sample-full-page.html 预览使用。
// 逻辑直接对应真实 render.js 里的 initScrollReveal / initMetricsCountUp,
// 让这个静态预览也能展示滚动淡入 + 数字递增效果。

function initScrollReveal() {
  var revealTargets = document.querySelectorAll(".section:not(.section-hero)");
  if (!revealTargets.length) return;

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });
}

function initMetricsCountUp() {
  var metricEls = document.querySelectorAll(".metric-value");
  if (!metricEls.length) return;

  var showFinalValue = function (el) {
    el.textContent = el.dataset.target + (el.dataset.suffix || "");
  };

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    metricEls.forEach(showFinalValue);
    return;
  }

  var animateCount = function (el) {
    var target = Number(el.dataset.target);
    var suffix = el.dataset.suffix || "";
    var duration = 800;
    var startTime = performance.now();

    var step = function (now) {
      var progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(target * progress) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  metricEls.forEach(function (el) {
    observer.observe(el);
  });
}

initScrollReveal();
initMetricsCountUp();
