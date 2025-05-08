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
    setRespuesta(null);

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

      // En vez de asignar el objeto completo, establecemos un mensaje simple de éxito.
      setRespuesta("Registro enviado exitosamente"); 
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
        {/* Botón que envía el formulario */}
        <button type="submit">Enviar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {respuesta && (
        <div>
          <h2>{respuesta}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
