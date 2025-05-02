package almacenamiento

import (
	"errors"
	"sync"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/models"
)

var (
	// Variable interna para sincronizar el acceso
	mutex = sync.Mutex{}
	// Slice que almacena los registros
	registros = []models.RegistroMuerte{}
)

// GuardarRegistro añade un registro al almacenamiento en memoria.
func GuardarRegistro(registro models.RegistroMuerte) error {
	mutex.Lock()
	defer mutex.Unlock()
	registros = append(registros, registro)
	return nil
}

// ObtenerTodosRegistros devuelve todos los registros almacenados o un error si no existen.
func ObtenerTodosRegistros() ([]models.RegistroMuerte, error) {
	mutex.Lock()
	defer mutex.Unlock()
	if len(registros) == 0 {
		return nil, errors.New("no hay registros")
	}
	return registros, nil
}
