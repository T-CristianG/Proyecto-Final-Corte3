package api

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/models"
	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/repository"
)

// RegistrarMuerte procesa las peticiones POST para registrar una muerte.
func RegistrarMuerte(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// Parsear formulario con límite de 10 MB.
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Error al parsear el formulario: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Recoger y validar el campo "nombre"
	nombre := r.FormValue("nombre")
	if nombre == "" {
		http.Error(w, "El campo 'nombre' es obligatorio.", http.StatusBadRequest)
		return
	}

	// Asignar valor predeterminado a "causa" si está vacío.
	causa := r.FormValue("causa")
	if causa == "" {
		causa = "ataque al corazón"
	}

	// Obtener la foto del formulario.
	archivo, manejador, err := r.FormFile("foto")
	if err != nil {
		http.Error(w, "Error al recibir la foto: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer archivo.Close()

	// Asegurar que el directorio "uploads" existe.
	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		http.Error(w, "Error al crear el directorio uploads: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Guardar el archivo subido.
	rutaFoto := "./uploads/" + manejador.Filename
	destinoArchivo, err := os.Create(rutaFoto)
	if err != nil {
		http.Error(w, "Error al crear la foto en el servidor", http.StatusInternalServerError)
		return
	}
	defer destinoArchivo.Close()

	if _, err = io.Copy(destinoArchivo, archivo); err != nil {
		http.Error(w, "Error al guardar la foto", http.StatusInternalServerError)
		return
	}

	// Crear registro de la muerte con la fecha actual.
	registro := models.RegistroMuerte{
		ID:         repository.GenerarID(),
		Nombre:     nombre,
		Causa:      causa,
		FotoURL:    rutaFoto,
		Registrado: time.Now(),
	}

	// Guardar el registro en la "base de datos" en memoria.
	if err := repository.GuardarRegistro(registro); err != nil {
		http.Error(w, "Error al guardar el registro: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Responder en JSON con el registro creado.
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registro)
}

// ObtenerMuertes maneja las peticiones GET para devolver todos los registros.
func ObtenerMuertes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	registros, err := repository.ObtenerTodosRegistros()
	if err != nil {
		http.Error(w, "Error al obtener registros: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registros)
}
