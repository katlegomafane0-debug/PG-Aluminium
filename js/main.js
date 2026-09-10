(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Product catalog tabs ---------- */
  var tabs = document.querySelectorAll(".catalog__tab");
  var panels = document.querySelectorAll(".catalog__panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-target");

      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach(function (panel) {
        var match = panel.getAttribute("data-panel") === target;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    });
  });

  /* ---------- Finish swatches: the interactive differentiator ---------- */
  var root = document.documentElement;
  var allSwatches = document.querySelectorAll(".swatch");
  var previewName = document.getElementById("finish-preview-name");
  var previewTag = document.getElementById("finish-preview-tag");
  var previewFrame = document.getElementById("finish-preview-frame");
  var previewPhotoLeft = document.getElementById("finish-preview-photo-left");
  var previewPhotoRight = document.getElementById("finish-preview-photo-right");

  function selectSwatch(swatch) {
    allSwatches.forEach(function (s) {
      s.setAttribute("aria-selected", s === swatch ? "true" : "false");
    });
    var color = swatch.getAttribute("data-color");
    var name = swatch.getAttribute("data-name");
    var photoLeft = swatch.getAttribute("data-photo-left");
    var photoRight = swatch.getAttribute("data-photo-right");
    root.style.setProperty("--live-accent", color);
    root.style.setProperty("--live-accent-soft", hexToRgba(color, 0.14));
    if (previewName) previewName.textContent = name;

    if (photoLeft && photoRight && previewPhotoLeft && previewPhotoRight) {
      previewPhotoLeft.src = photoLeft;
      previewPhotoLeft.alt = name + " finish, installation photo";
      previewPhotoLeft.hidden = false;
      previewPhotoRight.src = photoRight;
      previewPhotoRight.alt = name + " finish, close-up detail photo";
      previewPhotoRight.hidden = false;
      if (previewFrame) previewFrame.classList.add("has-photo");
      if (previewTag) previewTag.hidden = false;
    } else {
      if (previewPhotoLeft) previewPhotoLeft.hidden = true;
      if (previewPhotoRight) previewPhotoRight.hidden = true;
      if (previewFrame) previewFrame.classList.remove("has-photo");
      if (previewTag) previewTag.hidden = true;
    }
  }

  function hexToRgba(hex, alpha) {
    var h = hex.replace("#", "");
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  allSwatches.forEach(function (swatch) {
    swatch.addEventListener("click", function () {
      selectSwatch(swatch);
    });
  });

  var initialSwatch = document.querySelector('.swatch[aria-selected="true"]');
  if (initialSwatch) selectSwatch(initialSwatch);

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Quote form validation ---------- */
  var form = document.getElementById("quote-form");
  var successMessage = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var row = field.closest(".form-row");
        var fieldValid = field.checkValidity();
        if (row) row.classList.toggle("has-error", !fieldValid);
        if (!fieldValid) valid = false;
      });

      if (valid) {
        successMessage.hidden = false;
        form.reset();
        form.querySelectorAll(".has-error").forEach(function (row) {
          row.classList.remove("has-error");
        });
      } else {
        successMessage.hidden = true;
        var firstError = form.querySelector(".has-error input, .has-error select");
        if (firstError) firstError.focus();
      }
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("blur", function () {
        var row = field.closest(".form-row");
        if (row) row.classList.toggle("has-error", !field.checkValidity());
      });
    });
  }
})();
