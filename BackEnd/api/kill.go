package api

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/models"
	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/repository"
)

var db *sql.DB

// SetDB inyecta la conexión a la base de datos para que el paquete API pueda usarla.
func SetDB(database *sql.DB) {
	db = database
}

// RegistrarMuerte procesa el POST para registrar una nueva "muerte".
func RegistrarMuerte(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Error al parsear el formulario: "+err.Error(), http.StatusBadRequest)
		return
	}

	nombre := r.FormValue("nombre")
	if nombre == "" {
		http.Error(w, "El campo 'nombre' es obligatorio.", http.StatusBadRequest)
		return
	}

	edadStr := r.FormValue("edad")
	edad, err := strconv.Atoi(edadStr)
	if err != nil {
		http.Error(w, "Edad inválida: "+err.Error(), http.StatusBadRequest)
		return
	}

	causa := r.FormValue("causa")
	if causa == "" {
		causa = "ataque al corazón"
	}

	archivo, manejador, err := r.FormFile("foto")
	if err != nil {
		http.Error(w, "Error al recibir la foto: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer archivo.Close()

	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		http.Error(w, "Error al crear el directorio uploads: "+err.Error(), http.StatusInternalServerError)
		return
	}

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

	// Crea el nuevo registro incluyendo la edad.
	// Nota: Si en la base de datos usas una columna SERIAL para el ID, podrías no enviar este dato.
	registro := models.RegistroMuerte{
		ID:         repository.GenerarID(), // O bien, omitir el ID y dejar que lo genere la BD.
		Nombre:     nombre,
		Edad:       edad,
		Causa:      causa,
		FotoURL:    rutaFoto,
		Registrado: time.Now(),
	}

	// Guarda el registro en la base de datos.
	if err := repository.GuardarRegistro(registro); err != nil {
		http.Error(w, "Error al guardar el registro: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registro)
}

// ObtenerMuertes procesa el GET y devuelve los registros.
func ObtenerMuertes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// Consulta la base de datos para obtener todos los registros.
	registros, err := repository.ObtenerTodosRegistros()
	if err != nil {
		http.Error(w, "Error al obtener registros: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registros)
}
