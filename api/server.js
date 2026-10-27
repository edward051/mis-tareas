const http = require('http');

const PUERTO = process.env.PUERTO || 80;
const NOTA_MINIMA = 3.0;
const NOTAS_DEL_CURSO = [4.5, 3.5, 2.5, 4.0];
const EQUIPO = {
  equipo: 'Equipo Lonely',
  integrantes: ['Edward Josué Sánchez López'],
};

function responder(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos, null, 2));
}

function calcularPromedio(notas) {
  return notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
}

function estaAprobado(promedio) {
  return promedio >= NOTA_MINIMA;
}

function resumenDeNotas() {
  const promedio = calcularPromedio(NOTAS_DEL_CURSO);
  return { promedio, aprobado: estaAprobado(promedio) };
}

const rutas = {
  '/salud': () => ({ estado: 'ok' }),
  '/equipo': () => EQUIPO,
  '/notas': resumenDeNotas,
};

const servidor = http.createServer((req, res) => {
  const atender = rutas[req.url];
  if (atender) {
    responder(res, 200, atender());
  } else {
    responder(res, 404, { error: 'Ruta no encontrada' });
  }
});

servidor.listen(PUERTO);
