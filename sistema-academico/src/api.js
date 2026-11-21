// Toda la comunicacion con la API vive aqui. La direccion sale de una variable de entorno:
// cambiar de ambiente (local o EC2) no obliga a tocar los componentes.
const BASE = import.meta.env.VITE_API_URL;

// Una sola funcion para pedir, en vez de repetir fetch y el manejo de errores en cada llamada.
async function pedir(ruta, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con la API');
  }
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || 'La API respondió con un error');
  return datos;
}

export function obtenerEstudiantes() {
  return pedir('/estudiantes');
}

export function obtenerResumen() {
  return pedir('/estudiantes/resumen');
}

export function crearEstudiante(estudiante) {
  return pedir('/estudiantes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estudiante)
  });
}
