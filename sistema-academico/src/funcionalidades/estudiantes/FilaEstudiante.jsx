// El estado "aprobado" ya viene resuelto por la API: aqui solo se muestra.
function FilaEstudiante({ estudiante }) {
  return (
    <tr>
      <td>{estudiante.nombre}</td>
      <td>{estudiante.nota}</td>
      <td>{estudiante.aprobado ? 'Aprobado' : 'Reprobado'}</td>
    </tr>
  );
}

export default FilaEstudiante;
