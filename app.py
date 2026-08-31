import os
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

tareas = []
siguiente_id = 1


@app.route("/")
def inicio():
    return render_template("index.html", tareas=tareas)


@app.route("/crear", methods=["POST"])
def crear():
    global siguiente_id
    titulo = request.form["titulo"]
    fecha_limite = request.form.get("fecha_limite", "")
    tareas.append({
        "id": siguiente_id,
        "titulo": titulo,
        "fecha_limite": fecha_limite,
        "completada": False
    })
    siguiente_id += 1
    return redirect(url_for("inicio"))


@app.route("/modificar/<int:tarea_id>", methods=["GET", "POST"])
def modificar(tarea_id):
    tarea = next((t for t in tareas if t["id"] == tarea_id), None)
    if tarea is None:
        return redirect(url_for("inicio"))

    if request.method == "POST":
        tarea["titulo"] = request.form["titulo"]
        tarea["fecha_limite"] = request.form.get("fecha_limite", "")
        return redirect(url_for("inicio"))

    return render_template("modificar.html", tarea=tarea)


@app.route("/completar/<int:tarea_id>")
def completar(tarea_id):
    for tarea in tareas:
        if tarea["id"] == tarea_id:
            tarea["completada"] = True
    return redirect(url_for("inicio"))


@app.route("/descompletar/<int:tarea_id>")
def descompletar(tarea_id):
    for tarea in tareas:
        if tarea["id"] == tarea_id:
            tarea["completada"] = False
    return redirect(url_for("inicio"))


@app.route("/eliminar/<int:tarea_id>")
def eliminar(tarea_id):
    global tareas
    tareas = [t for t in tareas if t["id"] != tarea_id]
    return redirect(url_for("inicio"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))