package server

import (
	"log"
	"net/http"
	"os"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/config"
)

func Start() {

	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		log.Fatal("Error al crear el directorio uploads:", err)
	}

	router := InitRouter()
	port := config.GetPort()

	log.Println("Servidor iniciado en el puerto", port)
	log.Fatal(http.ListenAndServe(port, router))
}
