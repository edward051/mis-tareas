# ADR-001: Diseño del almacenamiento del proyecto en Amazon S3

- Fecha: 2026-10-20
- Autor: Edward Josué Sánchez López
- Estado: Aceptada

## Contexto

"Mis Tareas" nació como una aplicación Flask desplegada en Render. Como S3 solo sirve archivos estáticos, el proyecto se reescribió como un sitio estático (HTML, CSS y JavaScript, en `sitio-s3/`) y en la Fase 1 se publicó en un bucket público de Amazon S3, junto con un bucket privado de prueba.

Ese primer montaje funcionaba, pero no tenía ninguna protección: si alguien borraba `index.html` por error, el sitio se caía y no había forma de recuperarlo. En la prueba del Laboratorio 2 se borró el archivo y el sitio devolvió 404.

Además, hoy las tareas viven solo en el navegador de cada persona. Cuando el proyecto empiece a guardar datos reales (adjuntos, exportaciones de tareas, respaldos y registros de la aplicación), no existe un criterio de dónde ponerlos ni quién debe poder leerlos.

Activar el versionado resuelve el primer problema, pero crea otro: cada versión ocupa espacio y cuesta dinero, y sin control crece indefinidamente. Hace falta una estructura de almacenamiento con criterio, protección contra errores y costo acotado.

## Decision

- **Dos buckets con propósito distinto, en `us-east-1`:**
  - `cuc-bp-equipolonely-sitio-2026`: público, con alojamiento de sitio web estático. Su política solo permite `s3:GetObject` (leer), sin subir, borrar ni listar. Contiene únicamente el código del sitio.
  - `cuc-bp-eqsn-sanchez-privado-2026`: privado, con el bloqueo de todo el acceso público activado y sin política que lo abra. Contiene todo dato que no deba ser visible para cualquiera.
- **Prefijos en el bucket privado**, uno por tipo de dato: `uploads/` (adjuntos de usuarios), `exportaciones/` (tareas exportadas), `respaldos/` (copias de la base de datos) y `logs/` (registros de la aplicación).
- **Versionado activado en ambos buckets.** En el privado, porque guardará datos que no se pueden regenerar. En el del sitio, porque permite recuperar el sitio en minutos (se comprobó quitando el delete marker).
- **Regla de ciclo de vida `retencion-sitio`** en el bucket del sitio: pasar a Standard-IA a los 30 días, a Glacier Flexible Retrieval a los 90 días, y eliminar las versiones no vigentes a los 180 días.
- **Estimación de costo** (supuesto: 100 GB; con regla, 20 GB en Standard, 30 GB en Standard-IA y 50 GB en Glacier): 27,60 USD al año con todo en Standard contra 12,24 USD con la regla, un ahorro de 15,36 USD al año (56 %).

## Alternativas consideradas

1. **Dejar el sitio en Render (o en Netlify).** Descartada: el sitio ya es estático y no necesita un servidor de aplicaciones. Además, el proyecto del curso se traslada a infraestructura de AWS por fases, y S3 permite controlar permisos, versiones y costos por bucket y por prefijo.
2. **Usar un solo bucket para todo.** Descartada: para que el sitio sea público habría que desactivar el bloqueo de acceso público, y un solo error en la política expondría también los datos de usuarios. Con dos buckets, el privado está protegido por defecto (denegación implícita), como se comprobó con el 403.
3. **No activar el versionado.** Descartada: sin versiones, borrar `index.html` es irreversible y subir un archivo nuevo pisa el anterior. El costo de guardar versiones es pequeño y se puede acotar.
4. **Activar el versionado sin regla de ciclo de vida.** Descartada: las versiones se acumularían para siempre y el costo crecería sin control. La regla de retención lo limita a seis meses.

## Consecuencias

### Positivas

- Los errores son reversibles: un archivo borrado o sobrescrito se recupera sin volver a subirlo.
- Los datos sensibles quedan aislados del sitio público, y el bucket público solo puede leerse.
- Los prefijos permiten dar permisos y reglas distintas a cada tipo de dato.
- El costo de las versiones queda acotado: la estimación muestra un ahorro del 56 % con la regla.
- Las razones de la decisión quedan por escrito y versionadas junto al código.

### Costos o desventajas que aceptamos

- Las versiones no vigentes ocupan espacio y cuestan durante 180 días.
- A la escala actual (archivos de pocos KB) el ahorro real de la regla es casi nulo; su valor es preventivo.
- Hay dos buckets que mantener, y la política del público debe revisarse con cuidado.
- El sitio se sirve por HTTP, porque el sitio web estático de S3 no trae HTTPS propio.

### Que habria que revisar mas adelante

- **La regla aplica a todos los objetos del bucket del sitio**, así que a los 90 días los archivos del sitio en vivo pasarían a Glacier y dejarían de servirse al instante. Hay que limitar las transiciones a las versiones no vigentes o a un prefijo concreto.
- **El bucket privado tiene versionado pero no tiene regla de ciclo de vida.** Hay que crear una por prefijo (por ejemplo, que `logs/` expire y que `respaldos/` pase a Glacier).
- Los plazos de 30, 90 y 180 días son una primera estimación y deben ajustarse con el uso real.
- Cuando existan datos de usuarios, definir quién accede (la aplicación mediante permisos de IAM, no URLs directas) y evaluar cifrado.
- Poner un servicio con HTTPS delante del sitio.
