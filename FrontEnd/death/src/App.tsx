import React, { useState } from "react";
import './App.css';

const App: React.FC = () => {
  // Estados existentes
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [nombre, setNombre] = useState("");
  const [respuesta, setRespuesta] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Maneja la carga de la imagen (previsualización)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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
    formData.append("foto", file);

    try {
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

  // NUEVA FUNCIÓN: Obtiene todos los registros del back-end
  const obtenerMuertes = async () => {
    try {
      const res = await fetch("/api/muertes");
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      /* Aquí, setRespuesta(data) asigna la respuesta completa (un array con todos los registros)
         a la variable de estado respuesta, que luego se mostrará en el JSX. */
      setRespuesta(data); 
    } catch (err: any) {
      setError(err.message || "Error al obtener registros");
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
        {/* Botón que envía el formulario */}
        <button type="submit">Enviar</button>
      </form>
      {/* Botón para obtener la lista completa de registros */}
      <button type="button" onClick={obtenerMuertes}>Mostrar todos los registros</button>
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
