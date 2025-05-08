package config

import "os"

// GetPort retorna el puerto configurado en la variable de entorno PORT o ":8000" por defecto.
func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	return ":" + port
}
