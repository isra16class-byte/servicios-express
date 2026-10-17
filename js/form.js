/* ==========================================================
   form.js – Interacción B: validación del formulario
   Antes de aceptar el envío comprueba:
   1) que los campos obligatorios tengan información,
   2) que el correo tenga un formato básico correcto,
   y muestra un mensaje de error o de confirmación.
   ========================================================== */

(function () {
  const formulario = document.getElementById("formulario");
  const resultado = document.getElementById("resultado-formulario");
  if (!formulario) return;

  const CORREO_BASICO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Cada regla devuelve un texto de error o "" si el campo es válido.
  const reglas = {
    nombre: (v) => (v.length < 2 ? "Escribe tu nombre (mínimo 2 letras)." : ""),
    correo: (v) => {
      if (v === "") return "Escribe tu correo electrónico.";
      if (!CORREO_BASICO.test(v)) return "Revisa el correo: debe tener la forma nombre@dominio.com.";
      return "";
    },
    servicio: (v) => (v === "" ? "Elige el servicio que te interesa." : ""),
    mensaje: (v) => (v.length < 10 ? "Cuéntanos un poco más (mínimo 10 caracteres)." : "")
  };

  function validarCampo(nombre) {
    const campo = formulario.elements[nombre];
    const contenedor = campo.closest(".campo");
    const mensajeError = document.getElementById("error-" + nombre);
    const error = reglas[nombre](campo.value.trim());

    mensajeError.textContent = error;
    contenedor.classList.toggle("campo--invalido", error !== "");
    campo.setAttribute("aria-invalid", error !== "" ? "true" : "false");
    return error === "";
  }

  // Validación en vivo al salir de cada campo (y al corregir un error).
  Object.keys(reglas).forEach((nombre) => {
    const campo = formulario.elements[nombre];
    campo.addEventListener("blur", () => validarCampo(nombre));
    campo.addEventListener("input", () => {
      if (campo.closest(".campo").classList.contains("campo--invalido")) validarCampo(nombre);
    });
    campo.addEventListener("change", () => validarCampo(nombre));
  });

  // ---------- Orden de servicio en vivo ----------
  // Resumen visual del formulario. Usa SERVICIOS (definido en app.js)
  // para que los códigos y nombres estén en un solo lugar.
  const orden = document.getElementById("orden");

  function actualizarOrden() {
    if (!orden) return;
    const catalogo = typeof SERVICIOS !== "undefined" ? SERVICIOS : [];
    const elegido = catalogo.find((s) => s.id === formulario.elements.servicio.value);
    const nombre = formulario.elements.nombre.value.trim();
    const faltan = Object.keys(reglas).filter(
      (n) => reglas[n](formulario.elements[n].value.trim()) !== ""
    ).length;

    document.getElementById("orden-codigo").textContent = elegido ? elegido.codigo : "SX-—";
    document.getElementById("orden-cliente").textContent = nombre || "—";
    document.getElementById("orden-servicio").textContent = elegido ? elegido.nombre : "Sin elegir";
    document.getElementById("orden-modalidad").textContent = elegido
      ? (elegido.modalidad === "remoto" ? "Remoto" : "Presencial")
      : "—";
    document.getElementById("orden-estado").textContent =
      faltan === 0 ? "Lista para enviar" : faltan === 1 ? "Falta 1 campo" : `Faltan ${faltan} campos`;

    orden.classList.toggle("orden--presencial", Boolean(elegido) && elegido.modalidad === "presencial");
    orden.classList.toggle("orden--remoto", Boolean(elegido) && elegido.modalidad === "remoto");
    orden.classList.toggle("orden--lista", faltan === 0);
  }

  // El select recibe un "change" que no burbujea (lo lanza app.js),
  // por eso se escucha en cada campo y no en el formulario.
  Object.keys(reglas).forEach((nombre) => {
    const campo = formulario.elements[nombre];
    campo.addEventListener("input", actualizarOrden);
    campo.addEventListener("change", actualizarOrden);
  });
  actualizarOrden();

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // prototipo: no se envía a ningún servidor

    const resultados = Object.keys(reglas).map(validarCampo);
    const todoCorrecto = resultados.every(Boolean);

    if (!todoCorrecto) {
      resultado.className = "resultado resultado--error";
      resultado.textContent = "Hay campos por corregir. Revisa los mensajes en rojo.";
      const primerError = formulario.querySelector(".campo--invalido input, .campo--invalido select, .campo--invalido textarea");
      if (primerError) primerError.focus();
      return;
    }

    const nombre = formulario.elements.nombre.value.trim();
    resultado.className = "resultado resultado--ok";
    resultado.textContent = `Gracias, ${nombre}. Recibimos tu mensaje y te escribiremos pronto.`;
    formulario.reset();
    Object.keys(reglas).forEach((n) => {
      document.getElementById("error-" + n).textContent = "";
      formulario.elements[n].closest(".campo").classList.remove("campo--invalido");
      formulario.elements[n].removeAttribute("aria-invalid");
    });
    actualizarOrden(); // reset() no dispara eventos; se actualiza a mano
  });
})();
