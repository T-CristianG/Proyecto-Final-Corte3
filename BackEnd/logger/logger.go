package logger

import "log"

// Info imprime un mensaje informativo.
func Info(msg string) {
	log.Println("INFO:", msg)
}

// Error imprime un mensaje de error.
func Error(msg string) {
	log.Println("ERROR:", msg)
}
