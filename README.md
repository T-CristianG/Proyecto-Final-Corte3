Death Note App - Full Stack (Go + React + Docker + PostgreSQL)

Este proyecto simula una libreta al estilo Death Note donde se pueden registrar "muertes" a través de una aplicación web. El backend está construido con Go, el frontend con React (Vite), y la base de datos corre en un contenedor Docker con PostgreSQL.

PASOS PARA EJECUTAR EL PROYECTO

Levantar los contenedores con Docker
Desde la ruta del backend, en símbolo del sistema:
docker-compose up --build -d
Esto iniciará los contenedores, incluyendo la base de datos.

Ejecutar el backend en Go
En la misma ruta del backend:
go run main.go
Esto activa el backend en el puerto 8000.

Iniciar el frontend (la libreta)
Desde la ruta del frontend (la libreta):
npm run dev
Esto levanta la aplicación React, normalmente en http://localhost:5173.

Verificación de datos
Todo lo que se escriba en la libreta (frontend) debe confirmarse en las siguientes rutas:
http://localhost:8000/api/muertes → Backend ejecutado con go run
http://localhost:8001/api/muertes → Backend dentro del contenedor Docker
Ambos deben mostrar exactamente los mismos registros. Si no es así, hay una desincronización.

ACCESO A LA BASE DE DATOS POSTGRESQL

Ver los contenedores activos
Desde cualquier ruta, en símbolo del sistema:
docker ps
Debes ver varios contenedores activos, incluyendo uno llamado algo como backend-db-1.

Acceder al contenedor de la base de datos
docker exec -it backend-db-1 psql -U deathnoteuser -d deathnotedb

Consultar la tabla de registros
Una vez dentro, aparecerá un prompt similar a:
deathnotedb=#
Entonces ejecuta:
\dt
Esto mostrará las tablas disponibles. Luego, para consultar los registros:
SELECT * FROM registro_muerte;
Esto mostrará todos los registros acumulados enviados desde la libreta.
