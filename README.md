# David Espínola — Portafolio

Portafolio personal de **Néstor David Espínola Delvalle**: soporte IT, desarrollo de software, proyectos y trayectoria académica/profesional. Sitio estático, sin frameworks ni build step, pensado para publicarse con GitHub Pages.

> ⚠️ Antes de publicar, revisá los comentarios `TODO` en `index.html` y `data.js`: marcan datos que faltan (el PDF del CV y enlaces a repositorios/capturas de los proyectos internos o académicos).

## Descripción

Página de una sola vista con: presentación, proyectos, sección "sobre mí", experiencia y formación, habilidades e idiomas, reconocimientos y contacto. El contenido principal está escrito directamente en el HTML (no depende de JavaScript para mostrarse); JavaScript solo agrega el menú móvil, animaciones suaves al hacer scroll y datos estructurados (JSON-LD) para buscadores.

## Tecnologías usadas

- HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `footer`)
- CSS3 (variables, grid, flexbox, responsive, `prefers-reduced-motion`)
- JavaScript vanilla (sin dependencias ni build step)
- Tipografías Manrope y DM Mono vía Google Fonts

## Estructura de archivos

```
├── index.html     # Contenido completo del sitio
├── styles.css      # Estilos (paleta oscura azul, responsive)
├── app.js          # Menú móvil, animaciones al scroll, JSON-LD
├── data.js         # Datos de apoyo para SEO (no renderiza contenido)
├── foto.jpg        # Foto de perfil usada en el hero
├── img/
│   ├── sigsol-1.jpg   # Captura: pantalla de inicio de sesión de SIGSOL
│   ├── sigsol-2.jpg   # Captura: dashboard de SIGSOL
│   └── sigsol-3.jpg   # Captura: formulario de nueva solicitud
├── cv-nestor-espinola.pdf   # TODO: agregar este archivo (CV descargable)
└── README.md
```

## Cómo verlo localmente

No necesita instalación. Dos opciones:

1. Abrir `index.html` directamente en el navegador (doble clic).
2. O levantar un servidor local simple, por ejemplo:
   ```bash
   python3 -m http.server 3000
   ```
   y luego entrar a `http://localhost:3000`.

## Cómo publicarlo en GitHub Pages

1. Confirmá el nombre del repositorio en GitHub (en el mensaje de la consigna se mencionaron dos nombres distintos: `nestor-espinola-portfolio` y `david-espinola-portfolio` — usá el que ya existe en tu cuenta).
2. Subí estos archivos a la rama `main` (raíz del repositorio):
   ```bash
   git init
   git add .
   git commit -m "Portafolio: versión liviana"
   git branch -M main
   git remote add origin https://github.com/d4vdxh1/<nombre-del-repositorio>.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `root`**.
4. El sitio queda publicado en `https://d4vdxh1.github.io/<nombre-del-repositorio>/` (puede tardar uno o dos minutos la primera vez).
5. Actualizá la URL en `data.js` (`person.url`) con la dirección final, para que el JSON-LD sea correcto.

## Pendientes antes de publicar

- [ ] Agregar `cv-nestor-espinola.pdf` a la raíz del repositorio.
- [ ] Completar enlaces a repositorio/capturas de "Sistema de gestión de tickets de soporte" y "Sistema de agendamiento y atención hospitalaria" si se pueden compartir.
- [ ] Confirmar el nombre definitivo del repositorio y actualizar este README y `data.js`.
