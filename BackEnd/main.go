package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/api"
	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/repository"
	_ "github.com/lib/pq" //darle a la campanita y ejecutar el codigo : go get github.com/lib/pq
)

func connectDB() (*sql.DB, error) {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	return sql.Open("postgres", connStr)
}

func main() {
	// Conecta a la base de datos.
	db, err := connectDB()
	if err != nil {
		log.Fatal("Error al conectar a la base de datos:", err)
	}

	// Inyecta la conexión en los paquetes que la usan.
	repository.SetDB(db)
	api.SetDB(db)

	// Define los endpoints.
	http.HandleFunc("/api/muerte", api.RegistrarMuerte)
	http.HandleFunc("/api/muertes", api.ObtenerMuertes)

	log.Println("Servidor corriendo en puerto 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
