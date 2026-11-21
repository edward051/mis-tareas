// De donde salen y donde se guardan los datos. Hoy viven en memoria; si manana hay una
// base de datos, solo cambia este archivo.
const estudiantes = [
  { id: 1, nombre: 'Ana', nota: 4.5 },
  { id: 2, nombre: 'Luis', nota: 2.8 }
];
let siguienteId = 3;

function listar() {
  return [...estudiantes];
}

function agregar({ nombre, nota }) {
  const nuevo = { id: siguienteId++, nombre, nota };
  estudiantes.push(nuevo);
  return nuevo;
}

module.exports = { listar, agregar };
