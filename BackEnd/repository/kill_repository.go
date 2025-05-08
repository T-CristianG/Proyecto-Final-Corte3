package repository

import (
	"errors"
	"sync"

	"BackEnd/models"
)

var (
	ultimoID                int = 0
	mutex                       = sync.Mutex{}
	almacenamientoRegistros     = []models.RegistroMuerte{}
)

// GenerarID retorna un ID incremental para cada registro.
func GenerarID() int {
	mutex.Lock()
	defer mutex.Unlock()

	ultimoID++
	return ultimoID
}

// GuardarRegistro añade un registro al almacenamiento en memoria.
func GuardarRegistro(registro models.RegistroMuerte) error {
	mutex.Lock()
	defer mutex.Unlock()
	almacenamientoRegistros = append(almacenamientoRegistros, registro)
	return nil
}

// ObtenerTodosRegistros devuelve todos los registros almacenados; si no hay ninguno, retorna un error.
func ObtenerTodosRegistros() ([]models.RegistroMuerte, error) {
	mutex.Lock()
	defer mutex.Unlock()
	if len(almacenamientoRegistros) == 0 {
		return nil, errors.New("no hay registros")
	}
	return almacenamientoRegistros, nil
}
