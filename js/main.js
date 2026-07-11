// Impact — shared site behavior

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("open") ? "true" : "false"
    );
  });
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
          // Drop the reveal classes once the entrance finishes so hover
          // transitions (lift, shadow) use their own faster timing.
          setTimeout(() => {
            entry.target.classList.remove("reveal", "reveal-d1", "reveal-d2", "reveal-d3", "visible");
          }, 1300);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Animated stat counters
function animateCount(el) {
  const end = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(end * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");
if (counters.length && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => countObserver.observe(el));
} else {
  counters.forEach((el) => {
    el.textContent = el.dataset.count + (el.dataset.suffix || "");
  });
}

// Contact form — opens the visitor's mail client addressed to info@we-impact.com
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const phone = data.get("phone") || "";
    const message = data.get("message") || "";
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
    );
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    window.location.href = `mailto:info@we-impact.com?subject=${subject}&body=${body}`;
  });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Scholarship cap draws itself in when scrolled into view
const cap = document.querySelector(".scholarship-icon");
if (cap) {
  if ("IntersectionObserver" in window) {
    const capObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cap.classList.add("draw");
            capObserver.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    capObserver.observe(cap);
  } else {
    cap.classList.add("draw");
  }
}

// Vision mission pillars draw themselves in when scrolled into view
const pillarRow = document.querySelector(".pillar-row");
if (pillarRow) {
  if ("IntersectionObserver" in window) {
    const pillarObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pillarRow.classList.add("draw");
            pillarObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    pillarObserver.observe(pillarRow);
  } else {
    pillarRow.classList.add("draw");
  }
}

// Live countdown to the Launch Gala
document.querySelectorAll("[data-countdown]").forEach(function (box) {
  var target = new Date(box.getAttribute("data-countdown")).getTime();
  if (isNaN(target)) return;
  var days = box.querySelector(".cd-days");
  var hours = box.querySelector(".cd-hours");
  var mins = box.querySelector(".cd-mins");
  var secs = box.querySelector(".cd-secs");
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    if (days) days.textContent = Math.floor(diff / 86400000);
    if (hours) hours.textContent = pad(Math.floor(diff / 3600000) % 24);
    if (mins) mins.textContent = pad(Math.floor(diff / 60000) % 60);
    if (secs) secs.textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);
});

// Join membership pop-out
const joinModal = document.getElementById("join-modal");
if (joinModal) {
  const openJoin = () => {
    joinModal.classList.add("open");
    document.body.classList.add("modal-open");
  };
  const closeJoin = () => {
    joinModal.classList.remove("open");
    document.body.classList.remove("modal-open");
  };
  document.querySelectorAll("[data-join-open]").forEach((btn) =>
    btn.addEventListener("click", openJoin)
  );
  document.querySelectorAll("[data-join-close]").forEach((btn) =>
    btn.addEventListener("click", closeJoin)
  );
  joinModal.addEventListener("click", (e) => {
    if (e.target === joinModal) closeJoin();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeJoin();
  });

  // The pop-out greets every visitor to the membership page —
  // they must close it to reach the page behind it.
  setTimeout(openJoin, 700);
}

// Welcome pop-up (home page) — greets each visitor once
const welcomeModal = document.getElementById("welcome-modal");
if (welcomeModal) {
  const openWelcome = () => {
    welcomeModal.classList.add("open");
    document.body.classList.add("modal-open");
  };
  const closeWelcome = () => {
    welcomeModal.classList.remove("open");
    document.body.classList.remove("modal-open");
    try { localStorage.setItem("impactGalaSeen", "1"); } catch (e) {}
  };
  welcomeModal.querySelectorAll("[data-welcome-close]").forEach((btn) =>
    btn.addEventListener("click", closeWelcome)
  );
  welcomeModal.addEventListener("click", (e) => {
    if (e.target === welcomeModal) closeWelcome();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeWelcome();
  });
  const emailForm = document.getElementById("welcome-email");
  if (emailForm) {
    emailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("welcome-email-input").value;
      window.location.href =
        "mailto:info@we-impact.com?subject=" +
        encodeURIComponent("Keep me posted") +
        "&body=" +
        encodeURIComponent("Please add me to the Impact updates list: " + email);
      closeWelcome();
    });
  }
  let seen = null;
  try { seen = localStorage.getItem("impactGalaSeen"); } catch (e) {}
  const force = window.location.search.indexOf("welcome=1") !== -1;
  if (!seen || force) setTimeout(openWelcome, 900);
}

// On small screens, shrink each section title just enough to fit one line
function fitSectionTitles() {
  var titles = document.querySelectorAll(".section-title, .page-hero h1");
  titles.forEach(function (el) {
    // Titles inside pop-outs are hidden at load (unmeasurable) — let them wrap
    if (el.closest(".join-backdrop")) return;
    el.style.fontSize = "";
    el.style.whiteSpace = "";
    if (window.innerWidth > 640) return;
    el.style.whiteSpace = "nowrap";
    var size = parseFloat(getComputedStyle(el).fontSize);
    var guard = 0;
    while (el.scrollWidth > el.clientWidth && size > 13 && guard < 60) {
      size -= 0.5;
      el.style.fontSize = size + "px";
      guard++;
    }
  });
}
window.addEventListener("load", fitSectionTitles);
window.addEventListener("resize", fitSectionTitles);
fitSectionTitles();

// Header shadow once the page is scrolled
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Back-to-top arch button
const topBtn = document.createElement("button");
topBtn.className = "back-to-top";
topBtn.setAttribute("aria-label", "Back to top");
topBtn.innerHTML =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
document.body.appendChild(topBtn);
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener(
  "scroll",
  () => topBtn.classList.toggle("visible", window.scrollY > 600),
  { passive: true }
);
