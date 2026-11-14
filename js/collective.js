// The Impact Collective (impact-collective.html) — page-scoped motion.
//
// Same pattern as js/auction.js: adds .ic-in to each [data-ic] block the
// first time it scrolls into view and never removes it. Content is only ever
// hidden under html.js (set by the inline script in <head>, which withdraws
// it after 3.5s if this file never arrives) and prefers-reduced-motion:
// no-preference, so the page reads in full without JS or with reduced motion.
//
// Also: the fairness line lights up word by word as it scrolls through the
// viewport; the rings drift toward the cursor; cards carry a cursor-follow
// highlight; the Join button is magnetic. All vanilla, rAF-throttled.
//
// ?static (or #static) reveals everything at once and switches motion off,
// for review stills. ?freeze=2000 pauses every animation at 2000ms, for the
// hero motion strip. Both are harmless in production.
(function () {
  "use strict";
  window.__icReady = true;

  var root = document.documentElement;
  var q = location.search.slice(1);
  var isStatic = /(^|&)static(=|&|$)/.test(q) || location.hash === "#static";
  var freeze = (q.match(/(^|&)freeze=(\d+)/) || [])[2];
  var mm = function (s) { return !!(window.matchMedia && window.matchMedia(s).matches); };
  var reduce = mm("(prefers-reduced-motion: reduce)");
  var canHover = mm("(hover: hover) and (pointer: fine)");
  var still = isStatic || reduce;
  if (isStatic) root.classList.add("ic-static");

  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  // ---- Stagger index on every revealed child ------------------------------
  each(document.querySelectorAll("[data-ic]"), function (el) {
    each(el.children, function (c, i) { c.style.setProperty("--i", i); });
  });

  // ---- In-view reveals -----------------------------------------------------
  var blocks = document.querySelectorAll("[data-ic]");
  var show = function (el) { el.classList.add("ic-in"); };
  if (still || !("IntersectionObserver" in window)) {
    each(blocks, show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    each(blocks, function (el) { io.observe(el); });

    // Rings and blobs only run while their section is on screen
    var live = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("ic-paused", !e.isIntersecting); });
    }, { threshold: 0 });
    each(document.querySelectorAll("[data-rings]"), function (el) { live.observe(el); });
  }

  // ---- Fairness line: split into words, light them up on scroll -------------
  var words = [];
  var quote = document.querySelector(".ic-words p");
  if (quote) {
    var text = quote.textContent.trim();
    quote.setAttribute("aria-label", text);
    quote.textContent = "";
    text.split(/\s+/).forEach(function (w, i, arr) {
      var s = document.createElement("span");
      s.className = "ic-w";
      s.setAttribute("aria-hidden", "true");
      if (/^(give|receive)\.?$/.test(w)) s.classList.add("is-key");
      s.textContent = w;
      quote.appendChild(s);
      words.push(s);
      if (i < arr.length - 1) quote.appendChild(document.createTextNode(" "));
    });
  }
  if (words.length && !still) {
    root.classList.add("ic-scroll");
    var lit = -1;
    var lightUp = function () {
      var r = quote.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.88;
      var end = vh * 0.32 - r.height * 0.5;
      var p = clamp((start - r.top) / (start - end), 0, 1);
      var n = Math.round(p * words.length);
      if (n === lit) return;
      lit = n;
      words.forEach(function (w, i) { w.classList.toggle("is-lit", i < n); });
    };
    var qTick = false;
    window.addEventListener("scroll", function () {
      if (!qTick) { qTick = true; requestAnimationFrame(function () { qTick = false; lightUp(); }); }
    }, { passive: true });
    window.addEventListener("resize", lightUp);
    lightUp();
  }

  if (still) return;

  // ---- Hero sky drifts slower than the page on scroll ----------------------
  var hero = document.querySelector(".ic-hero");
  if (hero) {
    var heroSky = hero.querySelector(".ic-sky");
    var sTick = false;
    window.addEventListener("scroll", function () {
      if (sTick) return;
      sTick = true;
      requestAnimationFrame(function () {
        sTick = false;
        var y = window.scrollY || window.pageYOffset;
        if (y <= hero.offsetHeight) heroSky.style.transform = "translate3d(0," + (y * 0.3).toFixed(1) + "px,0)";
      });
    }, { passive: true });
  }

  // ---- Drift words and the pitch-day photo move with the scroll ---------------
  var drift = document.querySelector(".ic-drift");
  var driftTrack = drift && drift.querySelector(".ic-drift-track");
  var frame = document.querySelector(".ic-photo-frame");
  var frameImg = frame && frame.querySelector("img");
  var dTick = false;
  var scrollFx = function () {
    dTick = false;
    var vh = window.innerHeight;
    if (driftTrack) {
      var dr = drift.getBoundingClientRect();
      if (dr.bottom > 0 && dr.top < vh) {
        var p = clamp((vh - dr.top) / (vh + dr.height), 0, 1);
        driftTrack.style.setProperty("--dx", (-2 - p * 26).toFixed(2) + "%");
      }
    }
    if (frameImg) {
      var fr = frame.getBoundingClientRect();
      if (fr.bottom > 0 && fr.top < vh) {
        var off = (fr.top + fr.height / 2 - vh / 2) / vh;
        frameImg.style.setProperty("--py", (off * -0.05 * fr.height).toFixed(1) + "px");
      }
    }
  };
  window.addEventListener("scroll", function () {
    if (!dTick) { dTick = true; requestAnimationFrame(scrollFx); }
  }, { passive: true });
  window.addEventListener("resize", scrollFx);
  scrollFx();

  if (canHover) {
    // Rings lean gently toward the cursor
    each(document.querySelectorAll("[data-rings]"), function (sec) {
      var rings = sec.querySelector(".ic-rings");
      if (!rings) return;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      var step = function () {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        rings.style.setProperty("--mx", cx.toFixed(2) + "px");
        rings.style.setProperty("--my", cy.toFixed(2) + "px");
        raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(step) : 0;
      };
      var kick = function () { if (!raf) raf = requestAnimationFrame(step); };
      sec.addEventListener("pointermove", function (e) {
        var r = sec.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 60;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 40;
        kick();
      });
      sec.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); });
    });

    // Cursor-follow highlight on member cards
    each(document.querySelectorAll(".ic-card"), function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--x", (e.clientX - r.left) + "px");
        card.style.setProperty("--y", (e.clientY - r.top) + "px");
      });
    });

    // Magnetic Join button
    each(document.querySelectorAll("[data-magnetic]"), function (btn) {
      var zone = btn.parentElement;
      zone.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var pull = Math.sqrt(dx * dx + dy * dy) < 160 ? 0.28 : 0;
        btn.style.setProperty("--bx", (dx * pull).toFixed(1) + "px");
        btn.style.setProperty("--by", (dy * pull).toFixed(1) + "px");
      });
      zone.addEventListener("pointerleave", function () {
        btn.style.setProperty("--bx", "0px");
        btn.style.setProperty("--by", "0px");
      });
    });
  }

  // ---- Review aid: freeze every animation at a given moment -------------------
  if (freeze && document.getAnimations) {
    var t = parseInt(freeze, 10);
    var stop = function () {
      document.getAnimations().forEach(function (a) { a.pause(); a.currentTime = t; });
    };
    stop();
    window.addEventListener("load", stop);
  }
})();
