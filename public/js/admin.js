const ESTADOS = ['Pendiente', 'En proceso', 'Resuelto'];
const filas = document.getElementById('filas');
const mensaje = document.getElementById('mensaje');
const resumen = document.getElementById('resumen');
const vacio = document.getElementById('vacio');

function celda(contenido, clase) {
  const td = document.createElement('td');
  if (clase) td.className = clase;
  if (contenido instanceof Node) td.appendChild(contenido); else td.textContent = contenido;
  return td;
}

function filaSolicitud(s) {
  const tr = document.createElement('tr');

  // textContent evita que texto escrito por un cliente se interprete como HTML
  const cliente = document.createElement('div');
  cliente.textContent = s.nombre;
  const correo = document.createElement('small');
  correo.textContent = s.correo;
  cliente.appendChild(correo);

  const selector = document.createElement('select');
  selector.className = 'sel-estado';
  selector.setAttribute('aria-label', `Estado de la solicitud ${s.id}`);
  selector.dataset.estado = s.estado;
  ESTADOS.forEach((e) => selector.add(new Option(e, e, false, e === s.estado)));
  selector.addEventListener('change', async () => {
    const r = await pedir(`/api/solicitudes/${s.id}`, 'PUT', { estado: selector.value });
    mostrarMensaje(mensaje, r.ok, r.ok ? `Solicitud ${s.id}: estado cambiado a «${r.data.estado}».` : r.mensaje);
    if (r.ok) selector.dataset.estado = r.data.estado; else cargar(false);
  });

  const borrar = document.createElement('button');
  borrar.type = 'button';
  borrar.className = 'boton boton--contorno boton--peligro';
  borrar.textContent = 'Eliminar';
  borrar.addEventListener('click', async () => {
    if (!confirm(`¿Eliminar la solicitud n.º ${s.id} de ${s.nombre}? Esta acción no se puede deshacer.`)) return;
    const r = await pedir(`/api/solicitudes/${s.id}`, 'DELETE');
    mostrarMensaje(mensaje, r.ok, r.mensaje);
    cargar(false);
  });

  tr.append(celda(String(s.id)), celda(s.fecha), celda(cliente), celda(s.servicio),
            celda(s.descripcion, 'tabla__desc'), celda(selector), celda(borrar));
  return tr;
}

async function cargar(limpiarMensaje = true) {
  if (limpiarMensaje) { mensaje.textContent = ''; mensaje.className = 'resultado'; }
  const r = await pedir('/api/solicitudes');
  if (r.estado === 401) { window.location.href = '/login.html'; return; }
  if (!r.ok) { mostrarMensaje(mensaje, false, r.mensaje); return; }

  filas.replaceChildren(...r.data.map(filaSolicitud));
  vacio.hidden = r.data.length > 0;
  resumen.textContent = r.data.length === 1 ? '1 solicitud registrada.' : `${r.data.length} solicitudes registradas.`;
}

document.getElementById('salir').addEventListener('click', async () => {
  await pedir('/api/logout', 'POST');
  window.location.href = '/login.html';
});

cargar();
