package server

import (
	"net/http"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/api"
)

// InitRouter define los endpoints y devuelve el mux para el servidor.
func InitRouter() *http.ServeMux {
	mux := http.NewServeMux()

	// Endpoint para registrar una nueva muerte
	mux.HandleFunc("/muerte", api.RegistrarMuerte)
	// Endpoint para obtener todas las muertes registradas
	mux.HandleFunc("/muertes", api.ObtenerMuertes)

	return mux
}
