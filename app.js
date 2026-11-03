/**
 * app.js
 * Comportamiento del sitio. El contenido ya está escrito en index.html:
 * este script solo agrega mejoras (menú móvil, animaciones suaves al
 * hacer scroll y datos estructurados para buscadores). Si JavaScript
 * está desactivado, la página sigue siendo completamente legible.
 */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Menú de navegación en móvil
  const menu = document.getElementById("menu");
  const menuToggle = document.getElementById("menu-toggle");
  if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Selector de idioma (ES/EN). El español ya está en el HTML por defecto;
  // el inglés vive en los atributos data-en / data-en-html / data-en-aria
  // de cada elemento, así que no hace falta duplicar el contenido en JS.
  const STORAGE_KEY = "de-portfolio-lang";
  const langToggle = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-toggle-label");

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    if (langLabel) langLabel.textContent = lang === "es" ? "English" : "Español";
    if (langToggle) langToggle.setAttribute("aria-label", lang === "es" ? "Switch site language to English" : "Cambiar idioma del sitio a español");

    document.querySelectorAll("[data-en]").forEach((el) => {
      if (!el.dataset.es) el.dataset.es = el.textContent;
      el.textContent = lang === "en" ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll("[data-en-html]").forEach((el) => {
      if (!el.dataset.esHtml) el.dataset.esHtml = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.enHtml : el.dataset.esHtml;
    });
    document.querySelectorAll("[data-en-aria]").forEach((el) => {
      if (!el.dataset.esAria) el.dataset.esAria = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" ? el.dataset.enAria : el.dataset.esAria);
    });

    const titleEl = document.getElementById("document-title");
    if (titleEl) {
      if (!titleEl.dataset.esTitle) titleEl.dataset.esTitle = titleEl.textContent;
      const newTitle = lang === "en" ? titleEl.dataset.en : titleEl.dataset.esTitle;
      titleEl.textContent = newTitle;
      document.title = newTitle;
    }
    const descEl = document.getElementById("meta-description");
    if (descEl) {
      if (!descEl.dataset.esDescription) descEl.dataset.esDescription = descEl.getAttribute("content");
      descEl.setAttribute("content", lang === "en" ? descEl.dataset.en : descEl.dataset.esDescription);
    }
  }

  if (langToggle) {
    let currentLang = localStorage.getItem(STORAGE_KEY) || "es";
    applyLanguage(currentLang);
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "es" ? "en" : "es";
      localStorage.setItem(STORAGE_KEY, currentLang);
      applyLanguage(currentLang);
    });
  }

  // Año actual en el pie de página
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animación suave al hacer scroll (se repite al subir y al bajar).
  // Si el usuario prefiere menos movimiento, el contenido ya es visible
  // por defecto (ver prefers-reduced-motion en styles.css) y esto no corre.
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  // Barra de progreso de lectura (liviana: un solo transform, sin JS extra)
  const progress = document.getElementById("progress");
  if (progress) {
    let ticking = false;
    const update = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, top / height)) : 0})`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  // Lightbox: amplía capturas y reproduce el video al hacer click.
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  const lightboxClose = document.getElementById("lightbox-close");
  let lastFocused = null;

  function openLightbox(node) {
    lastFocused = document.activeElement;
    lightboxContent.innerHTML = "";
    lightboxContent.appendChild(node);
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const video = lightboxContent.querySelector("video");
    if (video) video.pause();
    lightbox.hidden = true;
    lightboxContent.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".project-gallery > img").forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    const open = () => {
      const big = document.createElement("img");
      big.src = img.src;
      big.alt = img.alt;
      openLightbox(big);
    };
    img.addEventListener("click", open);
    img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });

  document.querySelectorAll(".gallery-video-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const video = document.createElement("video");
      video.src = btn.dataset.video;
      video.poster = btn.dataset.poster || "";
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      openLightbox(video);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });
  }

  // Datos estructurados (JSON-LD) para buscadores, a partir de data.js.
  // No afecta el contenido visible: solo ayuda a que Google entienda
  // quién sos y qué proyectos mostrás.
  if (typeof SITE_DATA !== "undefined") {
    const ld = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE_DATA.person.name,
      jobTitle: SITE_DATA.person.jobTitle,
      url: SITE_DATA.person.url,
      email: SITE_DATA.person.email,
      sameAs: SITE_DATA.person.sameAs,
      knowsAbout: SITE_DATA.projects.map((p) => p.name)
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
});