// Capa de rutas: solo recibe la peticion y responde. Las reglas viven en logica/.
const express = require('express');
const { responder } = require('../comun/http');
const repositorio = require('../datos/repositorio');
const { describirEstudiante, resumir, validarEstudiante } = require('../logica/reglas-notas');

const router = express.Router();

router.get('/', (req, res) => {
  responder(res, 200, repositorio.listar().map(describirEstudiante));
});

router.get('/resumen', (req, res) => {
  responder(res, 200, resumir(repositorio.listar()));
});

router.post('/', (req, res) => {
  const { error, estudiante } = validarEstudiante(req.body); // validar SIEMPRE en el servidor
  if (error) return responder(res, 400, { error });
  const nuevo = repositorio.agregar(estudiante);
  responder(res, 201, describirEstudiante(nuevo));
});

module.exports = router;
