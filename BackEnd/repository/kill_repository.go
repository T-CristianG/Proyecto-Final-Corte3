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

func GenerarID() int {
	mutex.Lock()
	defer mutex.Unlock()

	ultimoID++
	return ultimoID
}

func GuardarRegistro(registro models.RegistroMuerte) error {
	query := `
        INSERT INTO registro_muerte (nombre, edad, causa, detalles, foto_url, registrado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`
	err := DB.QueryRow(query,
		registro.Nombre,
		registro.Edad,
		registro.Causa,
		registro.Detalles,
		registro.FotoURL,
		registro.Registrado,
	).Scan(&registro.ID)
	if err != nil {
		return err
	}
	return nil
}

func ObtenerTodosRegistros() ([]models.RegistroMuerte, error) {
	rows, err := DB.Query(`
        SELECT id, nombre, edad, causa, detalles, foto_url, registrado
        FROM registro_muerte`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var registros []models.RegistroMuerte
	for rows.Next() {
		var r models.RegistroMuerte
		if err := rows.Scan(&r.ID, &r.Nombre, &r.Edad, &r.Causa, &r.Detalles, &r.FotoURL, &r.Registrado); err != nil {
			return nil, err
		}
		registros = append(registros, r)
	}
	if len(registros) == 0 {
		return nil, errors.New("no hay registros")
	}
	return registros, nil
}
