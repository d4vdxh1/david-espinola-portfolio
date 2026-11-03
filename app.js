/* Portfolio interactions — no framework or external runtime required. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const root = document.documentElement;
  const langButton = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");
  const themeButton = document.getElementById("theme-toggle");
  const themeIcon = themeButton ? themeButton.querySelector(".theme-icon") : null;
  const menuButton = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const dialog = document.getElementById("media-dialog");
  const dialogContent = document.getElementById("dialog-content");
  const dialogClose = document.getElementById("dialog-close");
  const descriptionMeta = document.getElementById("meta-description");

  function safeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (err) { /* storage may be disabled */ }
  }
  function safeLoad(key) {
    try { return localStorage.getItem(key); } catch (err) { return null; }
  }

  let currentLang = safeLoad("de-portfolio-lang") === "en" ? "en" : "es";

  function updateToolLabels() {
    if (langButton) {
      const toEnglish = currentLang === "es";
      const label = toEnglish ? "Switch to English" : "Cambiar idioma a español";
      langButton.setAttribute("aria-label", label);
      langButton.title = label;
      if (langLabel) langLabel.textContent = toEnglish ? "EN" : "ES";
    }
    const mode = root.dataset.theme === "light" ? "light" : "dark";
    if (themeButton) {
      const label = mode === "dark"
        ? (currentLang === "es" ? "Activar modo claro" : "Switch to light mode")
        : (currentLang === "es" ? "Activar modo oscuro" : "Switch to dark mode");
      themeButton.title = label;
      themeButton.setAttribute("aria-label", label);
      if (themeIcon) themeIcon.textContent = mode === "dark" ? "☼" : "☾";
    }
    if (menuButton && navLinks) {
      const open = navLinks.classList.contains("is-open");
      menuButton.setAttribute("aria-label", currentLang === "es"
        ? (open ? "Cerrar menú" : "Abrir menú")
        : (open ? "Close menu" : "Open menu"));
    }
  }

  function applyLanguage(lang) {
    currentLang = lang;
    root.lang = lang;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!Object.prototype.hasOwnProperty.call(el.dataset, "es")) {
        el.dataset.es = el.textContent;
      }
      if (el !== descriptionMeta) {
        el.textContent = lang === "en" ? el.dataset.en : el.dataset.es;
      }
    });
    document.querySelectorAll("[data-en-html]").forEach(function (el) {
      if (!Object.prototype.hasOwnProperty.call(el.dataset, "esHtml")) {
        el.dataset.esHtml = el.innerHTML;
      }
      el.innerHTML = lang === "en" ? el.dataset.enHtml : el.dataset.esHtml;
    });
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      if (!Object.prototype.hasOwnProperty.call(el.dataset, "esAria")) {
        el.dataset.esAria = el.getAttribute("aria-label") || "";
      }
      el.setAttribute("aria-label", lang === "en" ? el.dataset.enAria : el.dataset.esAria);
    });
    if (descriptionMeta) {
      if (!Object.prototype.hasOwnProperty.call(descriptionMeta.dataset, "esContent")) {
        descriptionMeta.dataset.esContent = descriptionMeta.getAttribute("content");
      }
      descriptionMeta.setAttribute("content", lang === "en"
        ? descriptionMeta.dataset.en : descriptionMeta.dataset.esContent);
    }
    document.querySelectorAll("[data-preview]").forEach(function (button) {
      if (button.dataset.alt && button.querySelector("img")) {
        const innerImage = button.querySelector("img");
        innerImage.alt = lang === "en" && button.dataset.enAlt
          ? button.dataset.enAlt : button.dataset.alt;
      }
    });
    safeStore("de-portfolio-lang", lang);
    updateToolLabels();
  }

  if (langButton) {
    langButton.addEventListener("click", function () {
      applyLanguage(currentLang === "es" ? "en" : "es");
    });
  }
  applyLanguage(currentLang);

  function applyTheme(next) {
    const mode = next === "light" ? "light" : "dark";
    root.dataset.theme = mode;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = mode === "dark" ? "#0c1017" : "#f7f8fa";
    safeStore("de-portfolio-theme", mode);
    updateToolLabels();
  }
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }
  applyTheme(root.dataset.theme);

  function setMenu(open) {
    if (!navLinks || !menuButton) return;
    navLinks.classList.toggle("is-open", Boolean(open));
    menuButton.setAttribute("aria-expanded", String(Boolean(open)));
    updateToolLabels();
  }
  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      setMenu(!navLinks.classList.contains("is-open"));
    });
    navLinks.querySelectorAll("a").forEach(function (anchor) {
      anchor.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("pointerdown", function (event) {
      if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) {
        setMenu(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        setMenu(false);
        menuButton.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 700) setMenu(false);
    }, { passive: true });
  }

  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    const image = gallery.querySelector(".gallery-main-image");
    const mainButton = gallery.querySelector("[data-preview]");
    const thumbs = gallery.querySelectorAll("[data-swap-src]");
    if (!image || !mainButton || !thumbs.length) return;
    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        const source = thumb.dataset.swapSrc;
        if (!source) return;
        image.src = source;
        image.alt = currentLang === "en" && thumb.dataset.enAlt
          ? thumb.dataset.enAlt : thumb.dataset.alt || "";
        mainButton.dataset.preview = source;
        mainButton.dataset.alt = thumb.dataset.alt || "";
        mainButton.dataset.enAlt = thumb.dataset.enAlt || "";
        thumbs.forEach(function (t) {
          t.classList.toggle("active", t === thumb);
          t.setAttribute("aria-pressed", String(t === thumb));
        });
      });
    });
    thumbs.forEach(function (t) { t.setAttribute("aria-pressed", String(t.classList.contains("active"))); });
  });

  function openMedia(element) {
    if (!dialog || !dialogContent || !dialog.showModal) return;
    dialogContent.replaceChildren(element);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    if (dialogClose) dialogClose.focus();
  }
  document.querySelectorAll("[data-preview]").forEach(function (button) {
    button.addEventListener("click", function () {
      const src = button.dataset.preview;
      if (!src) return;
      const image = document.createElement("img");
      image.src = src;
      image.alt = currentLang === "en" && button.dataset.enAlt
        ? button.dataset.enAlt : button.dataset.alt || "";
      openMedia(image);
    });
  });
  document.querySelectorAll("[data-preview-video]").forEach(function (button) {
    button.addEventListener("click", function () {
      const src = button.dataset.previewVideo;
      if (!src) return;
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.autoplay = true;
      openMedia(video);
    });
  });
  if (dialogClose && dialog) {
    dialogClose.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      const video = dialogContent ? dialogContent.querySelector("video") : null;
      if (video) video.pause();
      if (dialogContent) dialogContent.replaceChildren();
      document.body.classList.remove("dialog-open");
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if ("IntersectionObserver" in window) {
    const anchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(anchors).map(function (anchor) {
      return document.getElementById(anchor.getAttribute("href").slice(1));
    }).filter(Boolean);
    if (sections.length) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          anchors.forEach(function (anchor) {
            anchor.classList.toggle("is-active", anchor.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
      sections.forEach(function (section) { observer.observe(section); });
    }
  }

  if (typeof SITE_DATA !== "undefined") {
    const siteUrl = SITE_DATA.person.url;
    const sameAs = SITE_DATA.person.sameAs;
    const graph = [
      { "@type": "Person", name: SITE_DATA.person.name, url: siteUrl, jobTitle: SITE_DATA.person.jobTitle, sameAs: sameAs },
      { "@type": "WebSite", name: "David Espínola — Portafolio", url: siteUrl, inLanguage: ["es", "en"] }
    ];
    (SITE_DATA.projects || []).forEach(function (project) {
      graph.push({ "@type": "SoftwareApplication", name: project.name,
        description: project.description, url: project.url || siteUrl });
    });
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
  }
});

/* Progressive enhancement: subtle, accessible motion for the portfolio. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const root = document.documentElement;
  let scrollQueued = false;

  function updateScrollState() {
    scrollQueued = false;
    const scrollTop = Math.max(0, window.scrollY || root.scrollTop);
    const scrollable = Math.max(0, root.scrollHeight - window.innerHeight);
    if (header) header.classList.toggle("is-scrolled", scrollTop > 12);
    root.style.setProperty("--reading-progress",
      scrollable > 0 ? String(Math.min(1, scrollTop / scrollable)) : "0");
  }

  function queueScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollState);
  }
  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate, { passive: true });
  updateScrollState();

  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const selectors = [
    ".section-intro",
    ".about-content",
    ".timeline-item",
    ".project-card",
    ".skill-group",
    ".milestone",
    ".contact-box"
  ];
  const targets = [...document.querySelectorAll(selectors.join(", "))];
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("motion-shown");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -26px 0px" });

  targets.forEach(function (element) {
    const position = element.getBoundingClientRect();
    // Content visible at first paint remains visible and accessible immediately.
    if (position.top < window.innerHeight * 0.88) return;
    element.classList.add("motion-enter");
    if (element.classList.contains("project-card") || element.classList.contains("skill-group")) {
      const siblings = element.parentElement
        ? [...element.parentElement.children].filter((child) => child.matches(".project-card, .skill-group"))
        : [];
      const index = siblings.indexOf(element);
      element.style.setProperty("--motion-delay", String(Math.max(0, index % 2) * 85) + "ms");
    }
    observer.observe(element);
  });
  root.classList.add("motion-ready");
});
