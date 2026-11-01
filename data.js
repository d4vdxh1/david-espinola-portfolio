/**
 * data.js
 * Datos estructurados reutilizados por app.js para generar metadatos SEO
 * (JSON-LD). El contenido visible del sitio vive directamente en index.html
 * para que la página funcione igual con o sin JavaScript; este archivo NO
 * renderiza contenido, solo evita repetir los mismos enlaces dos veces.
 *
 * Si cambiás un enlace de contacto o agregás un proyecto con demo pública,
 * actualizá también acá para que el SEO quede consistente con la página.
 */
const SITE_DATA = {
  person: {
    name: "Néstor David Espínola Delvalle",
    jobTitle: "Soporte IT · Desarrollo de Software",
    url: "https://d4vdxh1.github.io/david-espinola-portfolio/", // TODO: confirmar URL final de GitHub Pages
    email: "mailto:davideesspinola@gmail.com",
    sameAs: [
      "https://github.com/d4vdxh1",
      "https://www.linkedin.com/in/david-espínola-032148446"
    ]
  },
  projects: [
    {
      name: "AJAC · Plataforma web oficial",
      description:
        "Plataforma web con calendario interactivo, galería multimedia, notificaciones push y panel de administración.",
      url: "https://ajac-website.web.app"
    },
    {
      name: "Sistema de gestión de tickets de soporte",
      description:
        "Sistema interno para registrar, asignar y dar seguimiento a incidencias de soporte técnico.",
      url: "" // TODO: agregar enlace a capturas o repo cuando esté disponible
    },
    {
      name: "Sistema de agendamiento y atención hospitalaria",
      description:
        "Proyecto académico grupal para ordenar el agendamiento de turnos y la atención de pacientes.",
      url: "" // TODO: agregar enlace a capturas o repo cuando esté disponible
    }
  ]
};
