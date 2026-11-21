import { useEffect, useState } from 'react';
import './App.css';
import Boton from './componentes/Boton';
import Indicador from './componentes/Indicador';
import FilaEstudiante from './funcionalidades/estudiantes/FilaEstudiante';
import { crearEstudiante, obtenerEstudiantes, obtenerResumen } from './api';

const DECIMALES_PROMEDIO = 2;

function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [nombre, setNombre] = useState('');
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0);

  // Cada vez que "recarga" cambia, este efecto vuelve a pedir los datos a la API.
  useEffect(() => {
    Promise.all([obtenerEstudiantes(), obtenerResumen()])
      .then(([lista, datosResumen]) => {
        setEstudiantes(lista);
        setResumen(datosResumen);
        setError('');
      })
      .catch(e => setError(e.message));
  }, [recarga]);

  async function agregar() {
    try {
      await crearEstudiante({ nombre, nota });
      setNombre('');
      setNota('');
      setRecarga(recarga + 1); // pide la lista y el resumen otra vez
    } catch (e) {
      setError(e.message); // aqui llega el mensaje de validacion de la API
    }
  }

  return (
    <>
      <h1>Notas</h1>

      <section className="resumen">
        <Indicador titulo="Promedio" valor={resumen ? resumen.promedio.toFixed(DECIMALES_PROMEDIO) : '-'} />
        <Indicador titulo="Aprobados" valor={resumen ? resumen.aprobados : '-'} />
        <Indicador titulo="Total" valor={resumen ? resumen.total : '-'} />
      </section>

      <section className="formulario">
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre del estudiante"
        />
        <input
          type="number"
          step="any"
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="Nota"
        />
        <Boton alHacerClic={agregar}>Agregar estudiante</Boton>
      </section>

      {error && <p role="alert" className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nota</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(e => <FilaEstudiante key={e.id} estudiante={e} />)}
        </tbody>
      </table>
    </>
  );
}

export default App;
