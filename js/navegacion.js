/* ==========================================================
   navegacion.js – Resalta en el menú la sección que se está viendo
   Al hacer scroll, busca la última sección cuya parte de arriba ya
   pasó una "línea de lectura" (35 % de la altura de la ventana) y
   le pone aria-current="location" a su enlace del menú.
   ========================================================== */

(function () {
  const enlaces = document.querySelectorAll('.menu a[href^="#"]');
  // Se incluye #contacto aunque no tenga enlace en el menú:
  // así, al llegar a él se apaga el resaltado de "Servicios".
  const secciones = ["servicios", "contacto", "externo"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!enlaces.length || !secciones.length) return;

  function actualizar() {
    const linea = window.innerHeight * 0.35;
    let actual = null;
    secciones.forEach((s) => {
      if (s.getBoundingClientRect().top <= linea) actual = s.id;
    });
    // Al final de la página la última sección puede no llegar a la línea.
    const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (alFinal) actual = secciones[secciones.length - 1].id;

    enlaces.forEach((a) => {
      if (a.getAttribute("href") === "#" + actual) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  // requestAnimationFrame evita recalcular más de una vez por cuadro
  let pendiente = false;
  window.addEventListener("scroll", () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; actualizar(); });
  }, { passive: true });
  window.addEventListener("resize", actualizar);
  actualizar();
})();
