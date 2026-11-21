// Reglas del negocio. Esta capa NO conoce HTTP: no menciona req ni res.

// La nota minima aprobatoria es 3.0. Si cambia, cambia aqui y en ninguna otra parte:
// el front no la repite, porque recibe el campo "aprobado" ya calculado por la API.
const NOTA_MINIMA = 3.0;
const ESCALA_MINIMA = 0;
const ESCALA_MAXIMA = 5;
const LONGITUD_MAXIMA_NOMBRE = 60;

function estaAprobado(nota) {
  return nota >= NOTA_MINIMA;
}

function calcularPromedio(notas) {
  if (notas.length === 0) return 0;
  return notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
}

// Devuelve { error } si los datos estan mal, o { estudiante } con los datos limpios.
function validarEstudiante(datos = {}) {
  const { nombre, nota } = datos;
  if (typeof nombre !== 'string' || nombre.trim() === '' || nota === undefined || nota === null || nota === '') {
    return { error: 'Faltan nombre o nota' };
  }
  if (nombre.trim().length > LONGITUD_MAXIMA_NOMBRE) {
    return { error: `El nombre no puede superar ${LONGITUD_MAXIMA_NOMBRE} caracteres` };
  }
  const notaNumerica = Number(nota);
  if (Number.isNaN(notaNumerica)) {
    return { error: 'La nota debe ser un número' };
  }
  if (notaNumerica < ESCALA_MINIMA || notaNumerica > ESCALA_MAXIMA) {
    return { error: `La nota debe estar entre ${ESCALA_MINIMA} y ${ESCALA_MAXIMA}` };
  }
  return { estudiante: { nombre: nombre.trim(), nota: notaNumerica } };
}

// Agrega el estado ya resuelto: el front solo lo muestra.
function describirEstudiante(estudiante) {
  return { ...estudiante, aprobado: estaAprobado(estudiante.nota) };
}

function resumir(estudiantes) {
  return {
    promedio: calcularPromedio(estudiantes.map(e => e.nota)),
    aprobados: estudiantes.filter(e => estaAprobado(e.nota)).length,
    total: estudiantes.length
  };
}

module.exports = { NOTA_MINIMA, estaAprobado, calcularPromedio, validarEstudiante, describirEstudiante, resumir };
