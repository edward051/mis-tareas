const http = require('http');
const d = [4.5, 3.5, 2.5, 4.0];
const s = http.createServer((req, res) => {
if (req.url === '/salud') {
res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
res.end(JSON.stringify({ estado: 'ok' }));
return;
}
if (req.url === '/equipo') {
res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
res.end(JSON.stringify({ equipo: 'Equipo NN',
integrantes: ['Nombre Uno', 'Nombre Dos'] }));
return;
}
if (req.url === '/notas') {
let t = 0;
for (let i = 0; i < d.length; i++) { t = t + d[i]; }
let p = t / d.length;
res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
res.end(JSON.stringify({ promedio: p, aprobado: p >= 3.0 }));
return;
}
res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});
s.listen(80);
