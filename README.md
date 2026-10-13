

Aplicación de lista de tareas que permite gestionar pendientes con fecha límite y control de estado (completada/pendiente)

## Funcionalidades
- Crear tarea
- Modificar tarea
- Poner fecha límite a una tarea
- Marcar tarea como completada
- Marcar tarea como no completada
- Eliminar tarea

## Despliegue en AWS

| Integrante | URL del sitio | Bucket publico | Bucket privado |
|---|---|---|---|
| Edward Josué Sánchez López | http://cuc-bp-equipolonely-sitio-2026.s3-website-us-east-1.amazonaws.com/ | cuc-bp-equipolonely-sitio-2026 | cuc-bp-eqsn-sanchez-privado-2026 |

El repositorio conserva la versión Flask del proyecto (desplegada antes en Render) y agrega en `sitio-s3/` una versión estática (HTML, CSS y JS), porque S3 solo sirve archivos estáticos. El bucket público sirve ese sitio y el privado guarda archivos internos con el acceso público bloqueado.
