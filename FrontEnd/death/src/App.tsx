import React, { useState } from "react";
import './App.css';

const App: React.FC = () => {
  // Estado para previsualizar la imagen
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // Estado para guardar el archivo (la imagen) seleccionado
  const [file, setFile] = useState<File | null>(null);
  // Estado para otros datos, como un nombre
  const [nombre, setNombre] = useState("");
  // Estado para mostrar la respuesta o errores del back-end
  const [respuesta, setRespuesta] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Función para manejar la carga de la imagen (solo previsualización y guardar el archivo)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Guardamos el archivo en el estado para enviarlo luego
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Función para enviar los datos (imagen y nombre) al back-end
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || !file) {
      setError("Debes ingresar un nombre y seleccionar una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    // Puedes agregar otros campos si es necesario, por ejemplo:
    // formData.append("causa", "ataque al corazón");
    formData.append("foto", file);

    try {
      // La solicitud se hace a /api/muerte, la cual se redirige al puerto 8000 mediante el proxy
      const res = await fetch("/api/muerte", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.statusText}`);
      }

      const data = await res.json();
      setRespuesta(data);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="front-cover">
        <img src="/images/death-note.png" alt="Death Note Logo" />
      </div>
      <form onSubmit={handleSubmit}>
        {/* Campo para el nombre */}
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        {/* Sección para previsualizar la imagen */}
        <div className="content" contentEditable={true}>
          {imageSrc && <img src={imageSrc} alt="Uploaded" className="uploaded-image" />}
        </div>
        {/* Botón para seleccionar la imagen */}
        <label className="upload-button">
          Cargar Foto
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            hidden
          />
        </label>
        {/* Botón Enviar que envía el formulario */}
        <button type="submit">Enviar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {respuesta && (
        <div>
          <h2>Respuesta del Servidor</h2>
          <pre>{JSON.stringify(respuesta, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
