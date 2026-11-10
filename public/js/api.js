// Función compartida para hablar con el servidor (evita repetir fetch en cada página).
async function pedir(url, metodo = 'GET', cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(cuerpo);
  }
  try {
    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json();
    return { estado: respuesta.status, ...datos };
  } catch (e) {
    return { estado: 0, ok: false, mensaje: 'No se pudo conectar con el servidor. Revisa tu conexión.' };
  }
}

function mostrarMensaje(elemento, ok, texto) {
  elemento.textContent = texto;
  elemento.className = 'resultado ' + (ok ? 'resultado--ok' : 'resultado--error');
}
