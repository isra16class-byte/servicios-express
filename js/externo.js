/* ==========================================================
   externo.js – Consulta de datos externos con fetch
   Fuente: JSONPlaceholder (https://jsonplaceholder.typicode.com/users)
   Si el servicio no responde, se usan datos de respaldo propios.
   Nota: los datos de respaldo están en este mismo archivo (y no en
   un .json aparte) porque los navegadores bloquean fetch() de
   archivos locales cuando la página se abre con doble clic (file://).
   ========================================================== */

(function () {
  const URL_API = "https://jsonplaceholder.typicode.com/users?_limit=3";
  const TIEMPO_MAXIMO_MS = 6000;

  const lista = document.getElementById("lista-externa");
  const estado = document.getElementById("estado-externo");
  if (!lista || !estado) return;

  // Datos de respaldo con la misma forma que devuelve la API.
  const DATOS_RESPALDO = [
    { name: "Persona de ejemplo 1", email: "ejemplo1@correo.example", company: { name: "Empresa Demo A" }, address: { city: "Guayaquil" } },
    { name: "Persona de ejemplo 2", email: "ejemplo2@correo.example", company: { name: "Empresa Demo B" }, address: { city: "Quito" } },
    { name: "Persona de ejemplo 3", email: "ejemplo3@correo.example", company: { name: "Empresa Demo C" }, address: { city: "Cuenca" } }
  ];

  // Crea las tarjetas con textContent (nunca innerHTML) para evitar inyección de código.
  function mostrar(registros) {
    lista.replaceChildren();
    registros.slice(0, 3).forEach((r) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "registro";

      const titulo = document.createElement("h3");
      titulo.textContent = r.name;

      const correo = document.createElement("p");
      correo.textContent = r.email;

      const detalle = document.createElement("p");
      detalle.textContent = `${r.company.name} · ${r.address.city}`;

      tarjeta.append(titulo, correo, detalle);
      lista.append(tarjeta);
    });
  }

  async function cargar() {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);

    try {
      const respuesta = await fetch(URL_API, { signal: controlador.signal });
      if (!respuesta.ok) throw new Error("Respuesta HTTP " + respuesta.status);
      const datos = await respuesta.json();
      if (!Array.isArray(datos) || datos.length < 3) throw new Error("Datos incompletos");

      mostrar(datos);
      estado.textContent = "Datos obtenidos de jsonplaceholder.typicode.com.";
    } catch (error) {
      console.warn("No se pudo consultar el servicio externo:", error);
      mostrar(DATOS_RESPALDO);
      estado.textContent =
        "No pudimos conectar con el servicio externo. Mostramos datos de ejemplo guardados en el proyecto.";
    } finally {
      clearTimeout(temporizador);
    }
  }

  cargar();
})();
