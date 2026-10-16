/* ==========================================================
   formulario.js – Interacción B: validación del formulario
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
  });
})();
