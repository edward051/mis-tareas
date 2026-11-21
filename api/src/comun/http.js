// Piezas compartidas por todas las rutas (DRY en el back-end).

// Una sola funcion para responder, en vez de repetir el formato en cada ruta.
function responder(res, codigo, datos) {
  res.status(codigo).json(datos);
}

// Middleware: se ejecuta antes de todas las rutas, escrito una sola vez.
function registrar(req, res, siguiente) {
  console.log(`${req.method} ${req.url}`);
  siguiente();
}

module.exports = { responder, registrar };
