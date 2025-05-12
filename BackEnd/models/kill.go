package models

import "time"

// RegistroMuerte representa el registro de la muerte de una persona.
type RegistroMuerte struct {
	ID         int       `json:"id"`
	Nombre     string    `json:"nombre"`
	Edad       int       `json:"edad"`
	Causa      string    `json:"causa"`
	FotoURL    string    `json:"fotoUrl"`
	Registrado time.Time `json:"registrado"`
}
