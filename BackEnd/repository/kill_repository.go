package repository

import (
	"errors"
	"sync"

	"github.com/T-CristianG/Proyecto-Final-Corte3/BackEnd/models"
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

// GuardarRegistro inserta un registro en la base de datos y actualiza el ID del registro.
func GuardarRegistro(registro models.RegistroMuerte) error {
	query := `
        INSERT INTO registro_muerte (nombre, edad, causa, foto_url, registrado)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`
	err := DB.QueryRow(query,
		registro.Nombre,
		registro.Edad,
		registro.Causa,
		registro.FotoURL,
		registro.Registrado,
	).Scan(&registro.ID)
	if err != nil {
		return err
	}
	return nil
}

// ObtenerTodosRegistros recupera todos los registros de la base de datos.
func ObtenerTodosRegistros() ([]models.RegistroMuerte, error) {
	rows, err := DB.Query(`
        SELECT id, nombre, edad, causa, foto_url, registrado
        FROM registro_muerte`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var registros []models.RegistroMuerte
	for rows.Next() {
		var r models.RegistroMuerte
		if err := rows.Scan(&r.ID, &r.Nombre, &r.Edad, &r.Causa, &r.FotoURL, &r.Registrado); err != nil {
			return nil, err
		}
		registros = append(registros, r)
	}
	if len(registros) == 0 {
		return nil, errors.New("no hay registros")
	}
	return registros, nil
}
