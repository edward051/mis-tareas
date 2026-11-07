export const NOTA_MINIMA = 3.0;

export function estaAprobado(nota) {
  return nota >= NOTA_MINIMA;
}