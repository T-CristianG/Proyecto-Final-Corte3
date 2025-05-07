package Registro

import "time"

type RegistroMuerte struct {
	ID         int       `json:"id"`
	Nombre     string    `json:"nombre"`
	Causa      string    `json:"causa"`
	FotoURL    string    `json:"fotoUrl"`
	Registrado time.Time `json:"registrado"`
}
