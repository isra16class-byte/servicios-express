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
    incluye: { type: Array, default: () => [] },
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
        <h3>{{ nombre }}</h3>
        <p>{{ descripcion }}</p>
        <ul>
          <li v-for="punto in incluye" :key="punto">{{ punto }}</li>
        </ul>
      </div>
      <div class="etiqueta__pie">
        <span class="barras" aria-hidden="true"></span>
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
    codigo: "SX-EQ",
    nombre: "Mantenimiento de computadoras",
    descripcion: "Dejamos tu equipo limpio, rápido y listo para trabajar.",
    modalidad: "presencial",
    incluye: ["Limpieza interna y cambio de pasta térmica", "Revisión de disco y memoria", "Eliminación de virus y programas innecesarios"]
  },
  {
    id: "redes",
    codigo: "SX-RD",
    nombre: "Instalación de redes domésticas",
    descripcion: "Llevamos buen Wi-Fi a todos los cuartos de tu casa.",
    modalidad: "presencial",
    incluye: ["Ubicación del router y repetidores", "Configuración segura de la red", "Prueba de velocidad en cada habitación"]
  },
  {
    id: "soporte",
    codigo: "SX-RM",
    nombre: "Soporte tecnológico remoto",
    descripcion: "Resolvemos tu problema por videollamada y control remoto.",
    modalidad: "remoto",
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
