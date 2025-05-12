# Usa una imagen base de Go
FROM golang:1.20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de módulos y descarga dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copia el resto del código de la aplicación
COPY . .

# Compila la aplicación y crea un ejecutable llamado "app"
RUN go build -o app .

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 8000

# Comando para ejecutar el contenedor
CMD ["./app"]
