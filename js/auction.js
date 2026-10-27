// Silent Auction (auction.html) — page-scoped motion.
//
// Adds .au-in to each block the first time it scrolls into view and never
// removes it. The shared .reveal observer in main.js strips its classes after
// 1300ms, which would snap these longer sequences to their end state, so this
// page keys everything to its own class instead.
//
// Content is only ever hidden under html.js (set by the inline script in
// <head>) and prefers-reduced-motion: no-preference. If this file fails to
// load, that inline script drops .js after 3.5s and the page shows as-is.
//
// ?static (or #static) adds every in-view class at once and switches motion
// off, so screenshots show the finished page. Harmless in production.
(function () {
  "use strict";
  window.__auReady = true;

  var root = document.documentElement;
  var EASE = "cubic-bezier(.2,.7,.2,1)";
  var isStatic = /(^|[?&])static(=|&|$)/.test(location.search.slice(1)) || location.hash === "#static";
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (isStatic) root.classList.add("au-static");

  // ---- In-view reveals --------------------------------------------------
  var blocks = document.querySelectorAll(
    ".glance-grid, .lots .au-head, .lot-media, .lot-intro, .lot-detail, .how-card, .au-cta"
  );
  var show = function (el) { el.classList.add("au-in"); };

  if (isStatic || reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(blocks, show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    Array.prototype.forEach.call(blocks, function (el) { io.observe(el); });

    // The slow drift on each lot photo only runs while the photo is on screen.
    var live = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("au-live", e.isIntersecting); });
    }, { threshold: 0 });
    Array.prototype.forEach.call(document.querySelectorAll(".lot-media"), function (el) { live.observe(el); });
  }

  // ---- "Good to know": smooth open and close ------------------------------
  Array.prototype.forEach.call(document.querySelectorAll(".lot-notes"), function (d) {
    var summary = d.querySelector("summary");
    var wrap = d.querySelector(".ln-wrap");
    if (!summary || !wrap || !wrap.animate) return;
    var anim = null;

    summary.addEventListener("click", function (ev) {
      if (reduce || isStatic) return; // native toggle
      ev.preventDefault();
      var current = wrap.getBoundingClientRect().height;
      if (anim) { anim.cancel(); anim = null; }
      var closing = d.open && !d.classList.contains("is-closing");

      if (closing) {
        d.classList.add("is-closing");
        anim = wrap.animate(
          [{ height: current + "px" }, { height: "0px" }],
          { duration: Math.min(560, 260 + current * 0.5), easing: EASE }
        );
        anim.onfinish = function () {
          d.open = false;
          d.classList.remove("is-closing");
          anim = null;
        };
      } else {
        var from = d.open ? current : 0;
        d.classList.remove("is-closing");
        d.open = true;
        var target = wrap.scrollHeight;
        anim = wrap.animate(
          [{ height: from + "px" }, { height: target + "px" }],
          { duration: Math.min(620, 300 + target * 0.5), easing: EASE }
        );
        anim.onfinish = function () { anim = null; };
      }
    });
  });
})();
