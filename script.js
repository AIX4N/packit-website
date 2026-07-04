/* PackIt — shared site interactions */
(function () {
  "use strict";

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            ro.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- How-it-works tabs ---------- */
  var rail = document.querySelector(".tab-rail");
  if (rail) {
    var btns = rail.querySelectorAll(".tab-btn");
    var thumb = rail.querySelector(".tab-thumb");
    var panels = document.querySelectorAll(".tab-panel");

    var moveThumb = function (btn) {
      if (!thumb) return;
      thumb.style.left = btn.offsetLeft + "px";
      thumb.style.width = btn.offsetWidth + "px";
    };

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        moveThumb(btn);
        panels.forEach(function (p) {
          p.classList.toggle("active", p.id === btn.dataset.panel);
        });
      });
    });

    var setInitial = function () {
      var active = rail.querySelector(".tab-btn.active") || btns[0];
      if (active) moveThumb(active);
    };
    // wait for fonts so widths are correct
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setInitial);
    }
    setInitial();
    window.addEventListener("resize", setInitial);
  }

  /* ---------- Journey timeline animation ---------- */
  var journey = document.querySelector(".journey");
  if (journey && "IntersectionObserver" in window) {
    var jo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          journey.classList.add("animate");
          var stages = journey.querySelectorAll(".j-stage");
          stages.forEach(function (stage, i) {
            setTimeout(function () { stage.classList.add("lit"); }, 350 + i * 480);
          });
          jo.unobserve(journey);
        });
      },
      { threshold: 0.4 }
    );
    jo.observe(journey);
  } else if (journey) {
    journey.classList.add("animate");
    journey.querySelectorAll(".j-stage").forEach(function (s) { s.classList.add("lit"); });
  }

  /* ---------- Reward estimator ----------
     Mirrors the in-app suggested-fee heuristic:
     base $50/kg × size multiplier, +10%+$5 fragile,
     +15%+$10 urgent, $15 minimum, rounded to $0.5   */
  var est = document.querySelector("[data-estimator]");
  if (est) {
    var range = est.querySelector('input[type="range"]');
    var weightOut = est.querySelector("[data-weight-out]");
    var priceOut = est.querySelector("[data-price-out]");
    var sizeBtns = est.querySelectorAll(".seg button");
    var toggles = est.querySelectorAll(".toggle-chip");

    var state = { weight: 2, size: 1.0, fragile: false, urgent: false };

    var render = function () {
      var fee = Math.max(0, state.weight) * 50 * state.size;
      if (state.fragile) fee = fee * 1.10 + 5;
      if (state.urgent) fee = fee * 1.15 + 10;
      fee = Math.max(fee, 15);
      fee = Math.round(fee * 2) / 2;
      if (priceOut) {
        priceOut.textContent =
          "$" + (fee % 1 === 0 ? fee.toFixed(0) : fee.toFixed(2));
      }
      if (weightOut) weightOut.textContent = state.weight + " kg";
      if (range) {
        var pct = ((state.weight - range.min) / (range.max - range.min)) * 100;
        range.style.setProperty("--pct", pct + "%");
      }
    };

    if (range) {
      range.addEventListener("input", function () {
        state.weight = parseFloat(range.value);
        render();
      });
    }
    sizeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        sizeBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        state.size = parseFloat(btn.dataset.mult);
        render();
      });
    });
    toggles.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chip.classList.toggle("active");
        state[chip.dataset.key] = chip.classList.contains("active");
        render();
      });
    });
    render();
  }

  /* ---------- FAQ: close siblings when one opens ---------- */
  document.querySelectorAll(".faq-group").forEach(function (group) {
    group.querySelectorAll("details").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        group.querySelectorAll("details[open]").forEach(function (other) {
          if (other !== d) other.open = false;
        });
      });
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
