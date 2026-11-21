// Levanta Express y monta las rutas.
require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const { responder, registrar } = require('./comun/http');
const rutasEstudiantes = require('./rutas/estudiantes');

const PUERTO = process.env.PORT || 3000;
const ORIGEN_PERMITIDO = process.env.ORIGEN_PERMITIDO || 'http://localhost:5173';
const LIMITE_CUERPO = '10kb';

const app = express();
app.use(cors({ origin: ORIGEN_PERMITIDO })); // solo el front autorizado, nunca cors() abierto
app.use(express.json({ limit: LIMITE_CUERPO }));
app.use(registrar);

app.get('/salud', (req, res) => responder(res, 200, { estado: 'ok' }));
app.use('/estudiantes', rutasEstudiantes);

// Ruta que no existe
app.use((req, res) => responder(res, 404, { error: 'Ruta no encontrada' }));

// Errores: JSON mal formado del cliente (400) o fallo del servidor (500)
app.use((err, req, res, siguiente) => {
  if (err.type === 'entity.parse.failed') {
    return responder(res, 400, { error: 'El cuerpo no es un JSON válido' });
  }
  console.error(err);
  responder(res, 500, { error: 'Error interno del servidor' });
});

app.listen(PUERTO, () => console.log('API escuchando en el puerto ' + PUERTO));
