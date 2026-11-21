(function () {
  "use strict";

  var CLAVE = "mis-tareas";
  var tareas = cargar();
  var editandoId = null;

  var $ = function (id) { return document.getElementById(id); };
  var formulario = $("formulario");
  var campoTexto = $("texto");
  var campoFecha = $("fecha");
  var botonGuardar = $("guardar");
  var botonCancelar = $("cancelar");
  var lista = $("lista");
  var vacio = $("vacio");
  var resumen = $("resumen");

  function cargar() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarTodo() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(tareas));
    } catch (e) { /* si el navegador bloquea el almacenamiento, la lista dura solo esta sesión */ }
  }

  function hoyISO() {
    var d = new Date();
    var mes = String(d.getMonth() + 1).padStart(2, "0");
    var dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
  }

  function formatearFecha(iso) {
    var p = iso.split("-");
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  }

  function crearBoton(texto, accion, extra) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "texto" + (extra ? " " + extra : "");
    b.textContent = texto;
    b.dataset.accion = accion;
    return b;
  }

  function dibujar() {
    lista.textContent = "";
    var hoy = hoyISO();

    tareas.forEach(function (t) {
      var li = document.createElement("li");
      var vencida = !t.hecha && t.fecha && t.fecha < hoy;
      li.className = "tarea" + (t.hecha ? " hecha" : "") + (vencida ? " vencida" : "");
      li.dataset.id = t.id;

      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = t.hecha;
      check.dataset.accion = "alternar";
      check.setAttribute("aria-label", "Marcar como completada: " + t.texto);

      var texto = document.createElement("span");
      texto.className = "texto";
      texto.textContent = t.texto;

      var fecha = document.createElement("span");
      fecha.className = "fecha";
      fecha.textContent = t.fecha
        ? (vencida ? "Venció el " : "Vence el ") + formatearFecha(t.fecha)
        : "Sin fecha límite";

      var botones = document.createElement("div");
      botones.className = "botones";
      botones.appendChild(crearBoton("Editar", "editar"));
      botones.appendChild(crearBoton("Eliminar", "eliminar", "peligro"));

      li.appendChild(check);
      li.appendChild(texto);
      li.appendChild(botones);
      li.appendChild(fecha);
      lista.appendChild(li);
    });

    var pendientes = tareas.filter(function (t) { return !t.hecha; }).length;
    vacio.hidden = tareas.length > 0;
    resumen.textContent = tareas.length === 0
      ? ""
      : pendientes + (pendientes === 1 ? " tarea pendiente" : " tareas pendientes") +
        " de " + tareas.length;
  }

  function salirDeEdicion() {
    editandoId = null;
    formulario.reset();
    botonGuardar.textContent = "Agregar tarea";
    botonCancelar.hidden = true;
  }

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    var texto = campoTexto.value.trim();
    if (!texto) return;

    if (editandoId) {
      tareas.forEach(function (t) {
        if (t.id === editandoId) {
          t.texto = texto;
          t.fecha = campoFecha.value;
        }
      });
    } else {
      tareas.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        texto: texto,
        fecha: campoFecha.value,
        hecha: false
      });
    }

    guardarTodo();
    salirDeEdicion();
    dibujar();
    campoTexto.focus();
  });

  botonCancelar.addEventListener("click", salirDeEdicion);

  lista.addEventListener("click", function (e) {
    var accion = e.target.dataset.accion;
    if (!accion || accion === "alternar") return;
    var id = e.target.closest("li").dataset.id;

    if (accion === "eliminar") {
      if (!confirm("¿Eliminar esta tarea?")) return;
      tareas = tareas.filter(function (t) { return t.id !== id; });
      if (editandoId === id) salirDeEdicion();
      guardarTodo();
      dibujar();
    }

    if (accion === "editar") {
      var t = tareas.filter(function (x) { return x.id === id; })[0];
      editandoId = id;
      campoTexto.value = t.texto;
      campoFecha.value = t.fecha || "";
      botonGuardar.textContent = "Guardar cambios";
      botonCancelar.hidden = false;
      campoTexto.focus();
    }
  });

  lista.addEventListener("change", function (e) {
    if (e.target.dataset.accion !== "alternar") return;
    var id = e.target.closest("li").dataset.id;
    tareas.forEach(function (t) {
      if (t.id === id) t.hecha = e.target.checked;
    });
    guardarTodo();
    dibujar();
  });

  dibujar();
})();
