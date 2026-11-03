/**
 * app.js
 * Comportamiento del sitio. El contenido ya está escrito en index.html:
 * este script solo agrega mejoras (menú móvil, animaciones suaves al
 * hacer scroll y datos estructurados para buscadores). Si JavaScript
 * está desactivado, la página sigue siendo completamente legible.
 */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Menú móvil: transiciones reversibles, salida con Escape y clic externo.
  const menu = document.getElementById("menu");
  const menuToggle = document.getElementById("menu-toggle");
  if (menu && menuToggle) {
    const setMenuOpen = (open) => {
      menu.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    };
    menuToggle.addEventListener("click", () => setMenuOpen(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setMenuOpen(false))
    );
    document.addEventListener("pointerdown", (event) => {
      if (menu.classList.contains("open") &&
          !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    }, { passive: true });
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

    document.querySelectorAll(".showcase-gallery").forEach((gallery) => {
      gallery.dispatchEvent(new Event("portfolio:language"));
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

  // Revelado una sola vez: sin parpadeo al volver a desplazarse.
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
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


  // Indicador discreto de la sección que se está leyendo.
  const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ("IntersectionObserver" in window && sectionLinks.length) {
    const lookup = new Map(sectionLinks.map((link) => [link.getAttribute("href").slice(1), link]));
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          link.classList.remove("is-current");
          link.removeAttribute("aria-current");
        });
        const active = lookup.get(entry.target.id);
        if (active) {
          active.classList.add("is-current");
          active.setAttribute("aria-current", "location");
        }
      });
    }, { rootMargin: "-28% 0px -60% 0px", threshold: 0 });
    lookup.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) activeObserver.observe(section);
    });
  }

  // Progreso de la trayectoria: solo transformaciones, sin bibliotecas.
  const timelines = Array.from(document.querySelectorAll(".timeline"));
  if (timelines.length && !prefersReducedMotion) {
    let timelineQueued = false;
    const drawTimelines = () => {
      const viewportMark = window.innerHeight * 0.72;
      timelines.forEach((timeline) => {
        const rect = timeline.getBoundingClientRect();
        const progressValue = Math.max(0, Math.min(1, (viewportMark - rect.top) / Math.max(rect.height, 1)));
        timeline.style.setProperty("--line-progress", String(progressValue));
      });
      timelineQueued = false;
    };
    const queueTimelines = () => {
      if (timelineQueued) return;
      timelineQueued = true;
      requestAnimationFrame(drawTimelines);
    };
    window.addEventListener("scroll", queueTimelines, { passive: true });
    window.addEventListener("resize", queueTimelines, { passive: true });
    queueTimelines();
  }

  // Lightbox: amplía capturas y reproduce el video al hacer click.
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  const lightboxClose = document.getElementById("lightbox-close");
  let lastFocused = null;
  let closeTimer = null;

  function openLightbox(node) {
    if (!lightbox || !lightboxContent || !lightboxClose) return;
    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    lastFocused = document.activeElement;
    lightboxContent.replaceChildren(node);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-active");
    requestAnimationFrame(() => {
      if (!lightbox.hidden) lightbox.classList.add("is-open");
    });
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    const video = lightboxContent.querySelector("video");
    if (video) video.pause();
    lightbox.classList.remove("is-open");
    const restoreFocus = lastFocused;
    const finish = () => {
      lightbox.hidden = true;
      lightboxContent.replaceChildren();
      document.body.classList.remove("lightbox-active");
      if (restoreFocus && typeof restoreFocus.focus === "function") restoreFocus.focus();
      closeTimer = null;
    };
    if (prefersReducedMotion) finish();
    else closeTimer = setTimeout(finish, 230);
  }

  // AJAC: mostrar la captura auténtica si existe; si aún no se subió,
  // conservar la maqueta previa como alternativa, sin imagen rota.
  const ajacScreenshot = document.querySelector("[data-ajac-screenshot]");
  if (ajacScreenshot) {
    const ajacVisual = ajacScreenshot.closest(".project-visual--ajac");
    const updateAjacVisual = () => {
      if (ajacVisual) {
        ajacVisual.classList.toggle("has-ajac-image", ajacScreenshot.complete && ajacScreenshot.naturalWidth > 0);
      }
    };
    ajacScreenshot.addEventListener("load", updateAjacVisual);
    ajacScreenshot.addEventListener("error", updateAjacVisual);
    updateAjacVisual();
  }

  // Galerías de casos reales: un visor grande y miniaturas sin superposición.
  // Se respeta el texto accesible en ambos idiomas.
  const showcaseGalleries = document.querySelectorAll(".showcase-gallery");
  showcaseGalleries.forEach((gallery) => {
    const mainButton = gallery.querySelector(".showcase-main");
    const mainImage = gallery.querySelector(".showcase-main-image");
    const thumbnails = [...gallery.querySelectorAll(".showcase-thumb")];
    const counter = gallery.querySelector(".showcase-count");
    if (!mainButton || !mainImage) return;

    const selectScreenshot = (index, moveFocus = false) => {
      const thumb = thumbnails[index];
      if (!thumb) return;
      const lang = document.documentElement.lang === "en" ? "en" : "es";
      mainImage.src = thumb.dataset.full;
      mainImage.alt = thumb.dataset[lang === "en" ? "altEn" : "altEs"] || thumb.dataset.altEs || "";
      thumbnails.forEach((other, otherIndex) => {
        const active = otherIndex === index;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      if (counter) counter.textContent = String(index + 1).padStart(2, "0") + " / " + String(thumbnails.length).padStart(2, "0");
      if (moveFocus) thumb.focus();
    };

    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", () => selectScreenshot(index));
      thumb.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const next = (index + (event.key === "ArrowRight" ? 1 : -1) + thumbnails.length) % thumbnails.length;
        selectScreenshot(next, true);
      });
    });
    mainButton.addEventListener("click", () => {
      const big = document.createElement("img");
      big.src = mainImage.src;
      big.alt = mainImage.alt;
      openLightbox(big);
    });
    // El cambio de idioma también se refleja en el alt de la imagen activa.
    gallery.addEventListener("portfolio:language", () => {
      const index = Math.max(0, thumbnails.findIndex((thumb) => thumb.classList.contains("is-active")));
      if (thumbnails.length) selectScreenshot(index);
    });
    if (thumbnails.length) selectScreenshot(0); // Inicializa también el idioma recuperado de localStorage.
  });

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
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
      if (event.key !== "Tab") return;
      const focusable = [lightboxClose, ...lightboxContent.querySelectorAll('a[href], button, video[controls], [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
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