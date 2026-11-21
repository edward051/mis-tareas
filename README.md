# Sistema académico: estudiantes y notas

Aplicación web para registrar estudiantes con su nota y ver quién aprobó, con el promedio del grupo. El front está hecho con React y se publica en Amazon S3; la API está hecha con Node y Express y corre en una instancia EC2 de AWS.

> La carpeta raíz conserva los trabajos de los cortes anteriores: la app Flask (`app.py`, `templates/`) del primer corte y el sitio estático de `sitio-s3/` del segundo. El proyecto final está en `api/` y `sistema-academico/`.

## Integrantes

| Integrante | Responsabilidad |
|---|---|
| Edward Josué Sánchez López | Todo el proyecto: Git y Pull Requests, front en React, back-end en Node/Express, pruebas, despliegue en AWS y documentación. Equipo Lonely, trabajo individual autorizado por el docente. |

## Tecnologias

- **Front-end:** React con Vite (componentes, props y `useState`/`useEffect`).
- **Back-end:** Node.js con Express, organizado en capas (`rutas`, `logica`, `datos`).
- **Pruebas:** Vitest.
- **Infraestructura:** Amazon S3 (front y un bucket privado) y Amazon EC2 (API), con un Security Group de una sola regla.
- **Control de versiones:** Git y GitHub, con las ramas `main`, `pruebas` y `dev`, ramas por funcionalidad, Conventional Commits y Pull Requests.

## Como levantarlo en local

Requisitos: Node.js 18 o superior y Git.

```bash
git clone https://github.com/edward051/mis-tareas.git
cd mis-tareas

# 1. La API (en una terminal)
cd api
npm install
npm run dev          # escucha en http://localhost:3000

# 2. El front (en otra terminal)
cd sistema-academico
npm install
npm run dev          # abre http://localhost:5173
```

Variables de entorno:

| Variable | Dónde | Para qué | Valor en local |
|---|---|---|---|
| `PORT` | `api/` | Puerto de la API | `3000` (por defecto) |
| `ORIGEN_PERMITIDO` | `api/` | Dirección del front que puede llamar a la API (CORS) | `http://localhost:5173` (por defecto) |
| `VITE_API_URL` | `sistema-academico/` | Dirección de la API | `http://localhost:3000` (ya está en `.env.development`) |

`api/.env.example` y `sistema-academico/.env.example` muestran los nombres de las variables. Para producción se crea `sistema-academico/.env.production` a partir del ejemplo, con la IP pública de la instancia EC2. Los archivos `.env` reales no se suben a Git.

## Endpoints de la API

| Método | Ruta | Qué hace | Respuesta |
|---|---|---|---|
| GET | `/salud` | Comprueba que la API está viva | 200 · `{ "estado": "ok" }` |
| GET | `/estudiantes` | Lista todos los estudiantes, con el campo `aprobado` ya calculado | 200 · arreglo |
| GET | `/estudiantes/resumen` | Promedio, cuántos aprobaron y total | 200 · `{ promedio, aprobados, total }` |
| POST | `/estudiantes` | Agrega uno. Requiere `nombre` (texto, máximo 60 caracteres) y `nota` (de 0 a 5) | 201 · el creado<br>400 · datos inválidos, con un mensaje que dice qué está mal |

Cualquier otra ruta responde 404 con `{ "error": "Ruta no encontrada" }`, un JSON mal formado responde 400, y un fallo interno responde 500.

Ejemplo:

```bash
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","nota":3.5}'
# 201 {"id":3,"nombre":"Juan","nota":3.5,"aprobado":true}
```

## Como correr las pruebas

```bash
cd api
npm test
```

Son 15 pruebas con Vitest en `api/src/logica/reglas-notas.test.js`. Cubren la regla de aprobación (incluida la nota exacta de 3.0), el promedio (incluida la lista vacía), la validación de los datos (incluidos los extremos 0 y 5) y el resumen. La regla del negocio vive en `api/src/logica/reglas-notas.js` y no depende de HTTP, por eso se prueba sin levantar el servidor.

## Despliegue

- **Front:** `npm run build` en `sistema-academico/` genera la carpeta `dist/`. Su contenido se sube a la raíz del bucket público de S3 `cuc-bp-equipolonely-sitio-2026`, con alojamiento de sitio web estático y una política que solo permite leer los objetos: <http://cuc-bp-equipolonely-sitio-2026.s3-website-us-east-1.amazonaws.com/>
- **API:** instancia EC2 `t3.micro` con Amazon Linux 2023, en `us-east-1`. Se lanza pegando `despliegue/user-data-api.sh` en el campo *User data*: el script instala Node, clona este repositorio (rama `main`), instala las dependencias y deja la API corriendo como servicio en el puerto 80. El Security Group tiene una sola regla de entrada (HTTP 80) y SSH está cerrado.
- **Conectar los dos:** la IP pública de la instancia va en `sistema-academico/.env.production` (`VITE_API_URL`) antes de hacer el build, y la dirección del bucket va en `ORIGEN_PERMITIDO` del script (CORS).
- **Bucket privado:** `cuc-bp-eqsn-sanchez-privado-2026` bloquea todo el acceso público y responde 403 al abrir sus objetos por URL.
- **Costos:** la instancia se termina después de tomar las evidencias, porque una instancia encendida consume cerca de 12 dólares al mes del presupuesto del Learner Lab. Por eso la IP usada en la entrega (que está en el documento PDF) deja de responder cuando se cierran los recursos. Las decisiones de almacenamiento están en [`docs/adr-001-almacenamiento.md`](docs/adr-001-almacenamiento.md).

## Seguridad

- **Validación en el servidor:** la ruta POST valida el nombre y la nota y responde 400 con un mensaje claro.
- **Secretos fuera de Git:** `.gitignore` excluye `node_modules`, `.env`, `.env.local`, `.env.production` y `dist`; el repositorio solo trae los `.env.example`.
- **CORS restringido:** la API solo acepta peticiones del origen definido en `ORIGEN_PERMITIDO`, nunca `cors()` abierto.
- **Security Group mínimo:** solo el puerto 80, y SSH cerrado.
- **Dependencias:** el 20 de noviembre de 2026 ejecuté `npm audit` en `api/` y en `sistema-academico/`, y reportó 0 vulnerabilidades en ambas carpetas.
