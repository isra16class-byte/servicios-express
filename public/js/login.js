const form = document.getElementById('form-login');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const r = await pedir('/api/login', 'POST', Object.fromEntries(new FormData(form)));
  if (r.ok) {
    window.location.href = '/admin';
  } else {
    mostrarMensaje(mensaje, false, r.mensaje);
  }
});
