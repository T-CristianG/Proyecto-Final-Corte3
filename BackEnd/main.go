package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/api"
	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/repository"
	_ "github.com/lib/pq" // Ejecutar: go get github.com/lib/pq
)

// Conecta a la base de datos y devuelve la conexión.
func connectDB() (*sql.DB, error) {
	// Si las variables de entorno no están definidas, se usan valores por defecto.
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "deathnoteuser"
	}
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "deathnotepass"
	}
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "deathnotedb"
	}

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	return sql.Open("postgres", connStr)
}

// Crea la tabla en la base de datos si no existe.
func createTableIfNotExists(db *sql.DB) error {
	query := `
    CREATE TABLE IF NOT EXISTS registro_muerte (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        edad INT NOT NULL,
        causa VARCHAR(255) DEFAULT 'ataque al corazón',
        foto_url VARCHAR(512) NOT NULL,
        registrado TIMESTAMP NOT NULL
    );`
	_, err := db.Exec(query)
	return err
}

func main() {
	// Conecta a la base de datos.
	db, err := connectDB()
	if err != nil {
		log.Fatal("Error al conectar a la base de datos:", err)
	}

	// Verifica que la conexión esté activa.
	if err = db.Ping(); err != nil {
		log.Fatal("Error al hacer ping a la base de datos:", err)
	}

	// Crea la tabla si no existe.
	if err = createTableIfNotExists(db); err != nil {
		log.Fatal("Error al crear la tabla:", err)
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
