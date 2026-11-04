# David Espínola — Portafolio

Portafolio personal de David Espínola, con experiencia en soporte IT, desarrollo de software, bases de datos e integración de sistemas.

**Sitio publicado:** https://d4vdxh1.github.io/david-espinola-portfolio/

## Sobre el diseño

Rediseño original con enfoque de currículum interactivo: tipografía clara, experiencia compacta, proyectos en cuadrícula y componentes responsivos. No se ha copiado el diseño ni el código de otros portafolios; las ilustraciones de los proyectos sin capturas son conceptuales.

## Funcionalidades

- Selector español/inglés, con preferencia guardada localmente.
- Tema claro/oscuro, con preferencia guardada localmente y respeto al tema del dispositivo al entrar por primera vez.
- Secciones de presentación, perfil, experiencia, proyectos, formación, habilidades, reconocimientos y contacto.
- Tarjetas de proyectos con enlaces directos, estado y tecnologías.
- Centro de Salud: captura del acceso, enlace al repositorio y demostración con autenticación; requiere una cuenta válida de Supabase Auth para ingresar.
- Capturas reales para AJAC, SIGSOL, Heko Porã y Centro de Salud; galería y visor ampliado, más un video de Heko Porã.
- Navegación adaptable, etiquetas accesibles y compatibilidad con movimiento reducido.
- Metadatos estructurados para buscadores.

## Tecnologías

HTML5, CSS3 y JavaScript vanilla. No requiere framework ni proceso de compilación. La tipografía utiliza Google Fonts con alternativas locales.

## Ejecutar en local

Abrí la carpeta del repositorio con un servidor HTTP local:

~~~bash
python -m http.server 3000
~~~

Visitá http://localhost:3000.

También podés abrir index.html directamente; al usar un servidor local el comportamiento se parece más a GitHub Pages.

## Estructura

- index.html: contenido semántico y traducciones de interfaz.
- styles.css: diseño responsivo, tarjetas y temas.
- app.js: idiomas, temas, navegación y visor de multimedia.
- data.js: metadatos JSON-LD.
- img/: capturas auténticas usadas en el portafolio.
- video/: demostración en video de Heko Porã.
- cv-nestor-espinola.pdf.pdf: archivo de CV histórico actualmente enlazado desde la página.

## Editar y publicar

El contenido visible se edita directamente en index.html. Las traducciones al inglés están en los atributos data-en, data-en-html y data-en-aria; el español es el contenido por defecto. Las imágenes reales pueden abrirse en tamaño completo sin servicios externos.

El proyecto se publica mediante GitHub Pages desde main. Antes de reemplazar el CV, verificá los datos personales y actualizá también la ruta de descarga del HTML. Se conserva el nombre del archivo histórico para no romper descargas existentes.

## Privacidad y alcance

SIGSOL es un sistema interno: se muestran capturas y una descripción general, no su repositorio. Día a Día está en desarrollo, y Heko Porã es un trabajo académico grupal. No se presentan esas aplicaciones como servicios comerciales disponibles.

## Créditos

Diseño y contenido para el portafolio de David Espínola. La estructura visual se desarrolló de forma original, con referencia general a los patrones de portafolios y currículums web minimalistas.
