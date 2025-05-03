package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/Utils"
	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/models"

	almacenamiento "github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/Almacenamiento"
)

// RegistrarMuerte procesa la petición POST para registrar una nueva muerte.
func RegistrarMuerte(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// Parsear el formulario (máximo 10MB)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Error al parsear el formulario: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validar el campo "nombre"
	nombre := r.FormValue("nombre")
	if nombre == "" {
		http.Error(w, "El campo 'nombre' es obligatorio.", http.StatusBadRequest)
		return
	}

	// Si el campo "causa" está vacío, se asigna el valor por defecto.
	causa := r.FormValue("causa")
	if causa == "" {
		causa = "ataque al corazón"
	}

	// Procesar la foto enviada
	archivo, handler, err := r.FormFile("foto")
	if err != nil {
		http.Error(w, "Error al recibir la foto: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer archivo.Close()

	// Crear el directorio "uploads" si no existe
	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		http.Error(w, "Error al crear el directorio de uploads: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rutaFoto := "./uploads/" + handler.Filename
	destinoArchivo, err := os.Create(rutaFoto)
	if err != nil {
		http.Error(w, "Error al crear la foto en el servidor", http.StatusInternalServerError)
		return
	}
	defer destinoArchivo.Close()

	// Copiar el contenido del archivo
	if _, err := io.Copy(destinoArchivo, archivo); err != nil {
		http.Error(w, "Error al guardar la foto", http.StatusInternalServerError)
		return
	}

	// Crear el registro de la muerte.
	registro := models.RegistroMuerte{
		ID:         Utils.GenerarID(),
		Nombre:     nombre,
		Causa:      causa,
		FotoURL:    rutaFoto,
		Registrado: time.Now(),
	}

	// Guardar el registro en el almacenamiento en memoria.
	if err := almacenamiento.GuardarRegistro(registro); err != nil {
		http.Error(w, "Error al guardar el registro: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registro)
}

// ObtenerMuertes maneja la petición GET para listar todos los registros almacenados.
func ObtenerMuertes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	registros, err := almacenamiento.ObtenerTodosRegistros()
	if err != nil {
		http.Error(w, "Error al obtener registros: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registros)
}
