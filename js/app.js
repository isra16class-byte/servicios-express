/* ==========================================================
   app.js – Componente reutilizable y estado con Vue 3
   - TarjetaServicio: recibe nombre, descripción y modalidad.
   - Estado local: filtro seleccionado y servicio elegido.
   ========================================================== */

const { createApp } = Vue;

/* ---------- Componente reutilizable ---------- */
const TarjetaServicio = {
  name: "TarjetaServicio",
  props: {
    codigo: { type: String, default: "" },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    modalidad: { type: String, required: true }, // "presencial" | "remoto"
    icono: { type: String, default: "equipo" },  // "equipo" | "red" | "remoto"
    incluye: { type: Array, default: () => [] },
    lugar: { type: String, default: "" },
    tiempo: { type: String, default: "" },
    seleccionado: { type: Boolean, default: false }
  },
  emits: ["elegir"],
  computed: {
    etiqueta() {
      return this.modalidad === "remoto" ? "Remoto" : "Presencial";
    }
  },
  template: `
    <article class="etiqueta" :class="['etiqueta--' + modalidad, { 'etiqueta--elegida': seleccionado }]">
      <div class="etiqueta__cabecera">
        <span class="etiqueta__codigo">{{ codigo }}</span>
        <span>{{ etiqueta }}</span>
      </div>
      <div class="etiqueta__cuerpo">
        <div class="etiqueta__titulo">
          <span class="etiqueta__icono" aria-hidden="true">
            <svg v-if="icono === 'red'" viewBox="0 0 24 24">
              <rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 17h.01M11 17h.01M9.2 10.2a4 4 0 0 1 5.6 0M6.4 7.4a8 8 0 0 1 11.2 0"/>
            </svg>
            <svg v-else-if="icono === 'remoto'" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M10 7l5 2.4-2.2.8-.9 2.2z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <rect x="2.5" y="4" width="14" height="10" rx="1.5"/><path d="M1 18h15.5M14.5 22l5-5"/><circle cx="19.5" cy="13.5" r="2.8"/>
            </svg>
          </span>
          <h3>{{ nombre }}</h3>
        </div>
        <p>{{ descripcion }}</p>
        <ul>
          <li v-for="punto in incluye" :key="punto">{{ punto }}</li>
        </ul>
      </div>
      <div class="etiqueta__pie">
        <dl class="datos">
          <div>
            <dt>Dónde</dt>
            <dd>
              <svg v-if="modalidad === 'remoto'" class="datos__icono" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>
              </svg>
              <svg v-else class="datos__icono" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 11 12 4l9 7v9H3zM10 20v-6h4v6"/>
              </svg>
              {{ lugar }}
            </dd>
          </div>
          <div>
            <dt>Tiempo</dt>
            <dd>{{ tiempo }}</dd>
          </div>
        </dl>
        <button type="button" class="boton boton--contorno" @click="$emit('elegir')">
          {{ seleccionado ? 'Servicio elegido' : 'Pedir este servicio' }}
        </button>
      </div>
    </article>
  `
};

/* ---------- Datos de los tres servicios ---------- */
const SERVICIOS = [
  {
    id: "mantenimiento",
    icono: "equipo",
    codigo: "SX-EQ",
    nombre: "Mantenimiento de computadoras",
    descripcion: "Dejamos tu equipo limpio, rápido y listo para trabajar.",
    modalidad: "presencial",
    lugar: "En tu casa",
    tiempo: "1 a 2 horas",
    incluye: ["Limpieza interna y cambio de pasta térmica", "Revisión de disco y memoria", "Eliminación de virus y programas innecesarios"]
  },
  {
    id: "redes",
    icono: "red",
    codigo: "SX-RD",
    nombre: "Instalación de redes domésticas",
    descripcion: "Llevamos buen Wi-Fi a todos los cuartos de tu casa.",
    modalidad: "presencial",
    lugar: "En tu casa",
    tiempo: "2 a 4 horas",
    incluye: ["Ubicación del router y repetidores", "Configuración segura de la red", "Prueba de velocidad en cada habitación"]
  },
  {
    id: "soporte",
    icono: "remoto",
    codigo: "SX-RM",
    nombre: "Soporte tecnológico remoto",
    descripcion: "Resolvemos tu problema por videollamada y control remoto.",
    modalidad: "remoto",
    lugar: "Videollamada",
    tiempo: "Mismo día",
    incluye: ["Atención en pocas horas", "Ayuda con programas, correo y cuentas", "Sin costo de traslado"]
  }
];

/* ---------- Aplicación (estado: filtro y selección) ---------- */
createApp({
  data() {
    return {
      servicios: SERVICIOS,
      filtro: "todos",       // estado: filtro seleccionado
      seleccionado: null,    // estado: servicio elegido
      opciones: [
        { valor: "todos", texto: "Todos" },
        { valor: "presencial", texto: "Presenciales" },
        { valor: "remoto", texto: "Remotos" }
      ]
    };
  },
  computed: {
    visibles() {
      if (this.filtro === "todos") return this.servicios;
      return this.servicios.filter((s) => s.modalidad === this.filtro);
    },
    resumen() {
      const n = this.visibles.length;
      return n === 1 ? "Mostrando 1 servicio." : `Mostrando ${n} servicios.`;
    }
  },
  methods: {
    elegir(id) {
      this.seleccionado = id;
      // Prellena el formulario y lleva a la persona hasta él.
      const select = document.getElementById("servicio");
      if (select) {
        select.value = id;
        select.dispatchEvent(new Event("change"));
      }
      const destino = document.getElementById("contacto");
      if (destino) destino.scrollIntoView();
      if (select) select.focus({ preventScroll: true });
    }
  }
})
  .component("TarjetaServicio", TarjetaServicio)
  .mount("#app-servicios");
