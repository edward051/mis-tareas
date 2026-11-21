// Componente compartido: no sabe nada de notas, solo muestra un titulo y un valor.
function Indicador({ titulo, valor }) {
  return (
    <div className="indicador">
      <span className="indicador-titulo">{titulo}</span>
      <strong className="indicador-valor">{valor}</strong>
    </div>
  );
}

export default Indicador;
