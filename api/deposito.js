// Real Tattoo Company · formulario online de depósito (Instagram)
// La página (/realtattoo/deposit) envía aquí y esta función pasa los datos al sistema del estudio (Apps Script) desde el servidor.
// Así el navegador no habla con Google directamente (Safari bloquea esa redirección: "Load failed") y la dirección del sistema no se ve.

// Web app de Apps Script del estudio (la de la COPIA de prueba hasta pasar al sistema real)
const URL_SISTEMA = 'https://script.google.com/macros/s/AKfycbwG0469Qh4NDUDh73Ir_NWrK5POnMFE8h9-D3jgx4p6v8D1eijciQ9k6ocF5XCBMUA5/exec';

function texto(v, max) {
  return String(v == null ? '' : v).substring(0, max);
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  let d = req.body;
  if (typeof d === 'string') {
    try { d = JSON.parse(d); } catch (e) { d = null; }
  }
  if (!d || typeof d !== 'object') {
    res.status(400).json({ ok: false, error: 'Bad request' });
    return;
  }
  // Solo se reenvían los campos del formulario, y siempre como "formulario_online"
  const datos = {
    accion: 'formulario_online', cliente: texto(d.cliente, 80), telefono: texto(d.telefono, 30), cita: texto(d.cita, 20),
    titular: texto(d.titular, 80), web: texto(d.web, 80), idioma: d.idioma === 'es' ? 'es' : 'en'
  };
  try {
    const r = await fetch(URL_SISTEMA, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos),
      redirect: 'follow'
    });
    const respuesta = JSON.parse(await r.text());
    res.status(200).json({ ok: !!respuesta.ok, error: respuesta.ok ? undefined : respuesta.error });
  } catch (error) {
    console.error('Formulario de depósito: el sistema no respondió · ' + error.message);
    res.status(502).json({ ok: false, error: 'System not available' });
  }
};
