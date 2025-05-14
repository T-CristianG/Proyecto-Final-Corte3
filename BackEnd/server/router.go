package server

import (
	"net/http"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/api"
)

func InitRouter() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/muerte", api.RegistrarMuerte)

	mux.HandleFunc("/muertes", api.ObtenerMuertes)

	return mux
}
