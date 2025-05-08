package server

import (
	"log"
	"net/http"
	"os"

	"BackEnd/config"
)

// Start se encarga de inicializar el servidor y crear el directorio "uploads" si no existe.
func Start() {
	// Crear el directorio "uploads"
	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		log.Fatal("Error al crear el directorio uploads:", err)
	}

	router := InitRouter()
	port := config.GetPort() // Recupera el puerto, por defecto será ":8000"

	log.Println("Servidor iniciado en el puerto", port)
	log.Fatal(http.ListenAndServe(port, router))
}
