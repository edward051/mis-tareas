#!/bin/bash
# Despliegue de la API en una instancia EC2 con Amazon Linux 2023.
# Se pega completo en el campo "User data" al lanzar la instancia.
# Antes de usarlo, el codigo debe estar en la rama main del repositorio.
export HOME=/root

dnf install -y nodejs git

git clone --depth 1 --branch main https://github.com/edward051/mis-tareas.git /opt/mis-tareas
cd /opt/mis-tareas/api
npm install --omit=dev

cat > /etc/systemd/system/api.service <<'FIN'
[Unit]
Description=API del sistema academico
After=network.target

[Service]
WorkingDirectory=/opt/mis-tareas/api
Environment=PORT=80
Environment=ORIGEN_PERMITIDO=http://cuc-bp-equipolonely-sitio-2026.s3-website-us-east-1.amazonaws.com
ExecStart=/usr/bin/node src/servidor.js
Restart=always

[Install]
WantedBy=multi-user.target
FIN

systemctl daemon-reload
systemctl enable --now api
