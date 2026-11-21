import { describe, it, expect } from 'vitest';
import {
  estaAprobado,
  calcularPromedio,
  validarEstudiante,
  describirEstudiante,
  resumir
} from './reglas-notas';

describe('estaAprobado', () => {
  it('aprueba una nota por encima del minimo', () => {
    expect(estaAprobado(4.5)).toBe(true);
  });

  it('reprueba una nota por debajo del minimo', () => {
    expect(estaAprobado(2.8)).toBe(false);
  });

  it('aprueba la nota exacta de 3.0', () => { // caso limite: la frontera
    expect(estaAprobado(3.0)).toBe(true);
  });
});

describe('calcularPromedio', () => {
  it('calcula el promedio de varias notas', () => {
    expect(calcularPromedio([4.5, 3.5, 2.5, 4.0])).toBe(3.625);
  });

  it('devuelve la misma nota si solo hay una', () => {
    expect(calcularPromedio([4.0])).toBe(4.0);
  });

  it('devuelve 0 si la lista esta vacia', () => { // caso limite: lista vacia
    expect(calcularPromedio([])).toBe(0);
  });
});

describe('validarEstudiante', () => {
  it('acepta datos validos y limpia los espacios del nombre', () => {
    expect(validarEstudiante({ nombre: '  Ana  ', nota: 4.5 })).toEqual({
      estudiante: { nombre: 'Ana', nota: 4.5 }
    });
  });

  it('rechaza cuando falta el nombre', () => {
    expect(validarEstudiante({ nota: 3 }).error).toBe('Faltan nombre o nota');
  });

  it('rechaza una nota por encima de la escala', () => {
    expect(validarEstudiante({ nombre: 'Ana', nota: 7 }).error).toBe('La nota debe estar entre 0 y 5');
  });

  it('rechaza una nota negativa', () => {
    expect(validarEstudiante({ nombre: 'Ana', nota: -1 }).error).toBe('La nota debe estar entre 0 y 5');
  });

  it('acepta los extremos de la escala, 0 y 5', () => { // caso limite: bordes validos
    expect(validarEstudiante({ nombre: 'Ana', nota: 0 }).error).toBeUndefined();
    expect(validarEstudiante({ nombre: 'Ana', nota: 5 }).error).toBeUndefined();
  });

  it('rechaza una nota que no es un numero', () => {
    expect(validarEstudiante({ nombre: 'Ana', nota: 'abc' }).error).toBe('La nota debe ser un número');
  });

  it('rechaza un nombre demasiado largo', () => {
    expect(validarEstudiante({ nombre: 'A'.repeat(61), nota: 3 }).error).toBeDefined();
  });
});

describe('describirEstudiante', () => {
  it('agrega el estado aprobado ya calculado', () => {
    expect(describirEstudiante({ id: 1, nombre: 'Ana', nota: 4.5 }).aprobado).toBe(true);
    expect(describirEstudiante({ id: 2, nombre: 'Luis', nota: 2.8 }).aprobado).toBe(false);
  });
});

describe('resumir', () => {
  it('cuenta los aprobados y calcula el promedio', () => {
    const lista = [{ nota: 4.5 }, { nota: 2.5 }, { nota: 3.0 }];
    expect(resumir(lista)).toEqual({ promedio: 10 / 3, aprobados: 2, total: 3 });
  });
});
