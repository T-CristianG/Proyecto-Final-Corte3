// repository/db.go
package repository

import "database/sql"

// DB es la variable global que almacenará la conexión a la base de datos.
var DB *sql.DB

// SetDB permite inyectar la conexión a la base de datos.
func SetDB(database *sql.DB) {
	DB = database
}
