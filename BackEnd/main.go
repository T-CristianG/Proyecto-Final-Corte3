package main

import (
	"log"
	"net/http"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/api"
)

func main() {
	// Asigna la función que maneja POST en /api/muerte.
	http.HandleFunc("/api/muerte", api.RegistrarMuerte)
	// (Opcional) Asigna la función para obtener registros en GET.
	http.HandleFunc("/api/muertes", api.ObtenerMuertes)

	log.Println("Servidor corriendo en puerto 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
