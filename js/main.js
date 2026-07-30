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
    // Dismissing the invitation releases the hero rings to draw in
    document.body.classList.remove("rings-wait");
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
  // The gala invitation greets every visit — guests must close it to continue
  setTimeout(openWelcome, 900);
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

// Rising Leaders Scholarship application pop-out.
// Answers are delivered to info@we-impact.com. Unlike the membership pop-out
// this one never auto-opens — it only appears when an Apply button is clicked.
const applyModal = document.getElementById("apply-modal");
if (applyModal) {
  const form = document.getElementById("apply-form");
  const done = document.getElementById("apply-done");
  const errBox = document.getElementById("apply-error");

  const openApply = (e) => {
    if (e) e.preventDefault();
    applyModal.classList.add("open");
    document.body.classList.add("modal-open");
    const first = form && form.querySelector("input, textarea");
    if (first) setTimeout(() => first.focus(), 250);
  };
  const closeApply = () => {
    applyModal.classList.remove("open");
    document.body.classList.remove("modal-open");
  };
  document.querySelectorAll("[data-apply-open]").forEach((b) =>
    b.addEventListener("click", openApply)
  );
  document.querySelectorAll("[data-apply-close]").forEach((b) =>
    b.addEventListener("click", closeApply)
  );
  applyModal.addEventListener("click", (e) => {
    if (e.target === applyModal) closeApply();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && applyModal.classList.contains("open")) closeApply();
  });

  if (form) {
    // The exact question the applicant read, section-numbered to match the form.
    // These used to be shortened third-person summaries ("What they charge, and
    // for what"), which made the email read like a form dump instead of a
    // filled-in application. Key order here is the row order in the email, so it
    // mirrors the order the applicant answered in.
    const LABELS = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      city: "City & state",
      businessname: "Business name",

      idea: "2.1 What is the business?",
      customer: "2.2 Who is your ideal customer?",
      different: "2.3 Who are your competitors, and what makes you different?",
      price: "2.4 How much do you charge, and for what?",
      cost: "2.5 What does it cost you to deliver that?",

      stage: "3.1 What stage are you at right now?",
      traction: "3.2 What have you already done or built with little or no money?",
      invested: "3.3 What have you personally put into this so far — money, hours, or sacrifice?",
      revenue: "3.4 Has the business made any money yet? How much, and over what period?",
      location: "3.5 Does this business need a physical location, vehicle, or equipment to operate — and do you have it?",
      time: "3.6 Hours per week you can give this",
      team: "3.7 Solo, or do you have partners / a team?",

      budget: "4.1 Break down how you would spend the $50,000. Give us real numbers.",
      first90: "4.2 What would you do in your first 90 days with the money?",
      sustain: "4.3 After the $50,000 is spent, how does the business keep going?",
      breakeven: "4.4 What does it take each month to cover your costs — and when do you expect to reach it?",
      otherfunding: "4.5 Have you applied for or received any other funding — loans, grants, investors, family?",

      legal: "5.1 What licenses, permits, certifications, or insurance does this business legally require — and which do you already have?",
      priorbiz: "5.2 Have you run a business before? What happened to it?",
      kill: "5.3 What is most likely to kill this business in its first year?",
      advisor: "5.4 Who have you talked to who has actually done this before?",

      year: "6.1 A year from now, what has to be true for this to be working?",
      obstacle: "6.2 What is the single biggest thing standing in your way right now?",
      ifnot: "6.3 If you don't win this scholarship, what happens to this business?",
      coachable: "6.4 Tell us about a time you were wrong about something and changed course.",

      giveback: "7.1 How would this business give back to your community?",
      profit: "7.2 Once the business is making more than it spends, what do you do with that money?",
      why: "7.3 Why this business, and why you?",

      availability: "8.1 When are you available for an interview and a pitch?",

      link: "9.1 Website, social page, or video pitch",
      anything: "9.2 Anything else we should know?",
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // validate, and point the applicant at the first thing they missed
      const missing = [];
      form.querySelectorAll("[required]").forEach((f) => {
        if (f.type === "checkbox") {
          if (!f.checked) missing.push(f);
        } else if (!f.value.trim()) {
          missing.push(f);
        }
      });
      const email = form.querySelector("#ap-email");
      const badEmail = email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      if (missing.length || badEmail) {
        const target = missing[0] || email;
        const firstIsBox = missing.length && missing[0].type === "checkbox";
        errBox.textContent = badEmail && !missing.length
          ? "That email address doesn't look right — we need it to reach you."
          : firstIsBox
          ? "Please confirm the three statements at the bottom to submit your application."
          : "Please answer the highlighted questions so we can consider your application.";
        errBox.style.display = "block";
        target.focus();
        target.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      errBox.style.display = "none";

      // Post the application straight to info@we-impact.com through the form
      // handler. The applicant never touches their own email app.
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const acks = ["ack_truthful", "ack_mentorship", "ack_accountable"];
      const allAcked = acks.every(
        (a) => form.querySelector('[name="' + a + '"]').checked
      );

      // Send this as JSON, NOT as FormData. FormSubmit slugifies the field names
      // of a multipart body \u2014 "City & state" arrived in the inbox as
      // "City_&_state" and the questions came out mangled. A JSON body keeps every
      // label exactly as written. Verified both ways against the live endpoint.
      const payload = {
        _subject: "Scholarship Application \u2014 " + name,
        _template: "table",
        _captcha: "false",
      };

      // so hitting Reply in the inbox goes straight to the applicant
      const applicantEmail = (data.get("email") || "").toString().trim();
      if (applicantEmail) payload._replyto = applicantEmail;

      // honeypot: only sent when a bot filled the hidden field, so FormSubmit drops it
      const honey = (data.get("_honey") || "").toString().trim();
      if (honey) payload._honey = honey;

      payload.Commitments = allAcked
        ? "Confirmed: truthful \u00b7 monthly mentorship \u00b7 accountable for funds"
        : "NOT fully confirmed";

      Object.keys(LABELS).forEach((k) => {
        const v = (data.get(k) || "").toString().trim();
        if (v) payload[LABELS[k]] = v;
      });

      // plain-text copy kept locally, so a network failure never loses their work
      const lines = [];
      Object.keys(LABELS).forEach((k) => {
        const v = (data.get(k) || "").toString().trim();
        if (v) lines.push(LABELS[k] + ":\n" + v + "\n");
      });
      const body =
        "RISING LEADERS SCHOLARSHIP APPLICATION\n" +
        (allAcked ? "Confirmed: truthful \u00b7 monthly mentorship \u00b7 accountable for funds\n" : "") +
        "Submitted from we-impact.com\n\n" +
        lines.join("\n");
      try {
        localStorage.setItem("impact-scholarship-draft", body);
      } catch (_) {}

      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending your application\u2026";
      }

      fetch("https://formsubmit.co/ajax/f52ca603e6c8d6445c964b76509a766d", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      })
        .then((r) => {
          if (!r.ok) throw new Error("bad status " + r.status);
          return r.json();
        })
        .then(() => {
          try {
            localStorage.removeItem("impact-scholarship-draft");
          } catch (_) {}
          form.style.display = "none";
          done.style.display = "block";
          applyModal.scrollTop = 0;
        })
        .catch(() => {
          // Never lose an application. If the post fails, hand it to their mail
          // app as a fallback and tell them plainly what happened.
          if (btn) {
            btn.disabled = false;
            btn.textContent = btnText;
          }
          errBox.innerHTML =
            "We couldn't send that automatically \u2014 possibly a connection issue. " +
            'Your answers are saved. <a href="mailto:info@we-impact.com?subject=' +
            encodeURIComponent("Scholarship Application \u2014 " + name) +
            "&body=" +
            encodeURIComponent(body) +
            '"><strong>Click here to send it by email instead</strong></a>, or try again.';
          errBox.style.display = "block";
          errBox.scrollIntoView({ block: "center", behavior: "smooth" });
        });
    });

    // restore a draft if they came back after a hand-off
    try {
      const saved = localStorage.getItem("impact-scholarship-draft");
      if (saved) form.dataset.hadDraft = "1";
    } catch (_) {}
  }
}
