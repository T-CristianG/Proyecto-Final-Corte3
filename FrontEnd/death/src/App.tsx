import React, { useState, useEffect } from "react";
import './App.css';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [causa, setCausa] = useState("");
  const [error, setError] = useState<string>("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [muertes, setMuertes] = useState<any[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRespuesta(null);

    if (!nombre || !edad || !file) {
      setError("Debes ingresar nombre, edad y seleccionar una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("edad", edad);
    formData.append("causa", causa);
    formData.append("foto", file);

    try {
      const res = await fetch("/api/muerte", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.statusText}`);
      }

      setRespuesta("Registro enviado exitosamente");
      setNombre("");
      setEdad("");
      setCausa("");
      setFile(null);
      setImageSrc(null);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud");
      console.error(err);
    }
  };

  const fetchMuertes = async () => {
    try {
      const res = await fetch("/api/muertes");
      if (!res.ok) throw new Error("Error al obtener las muertes");
      const data = await res.json();
      setMuertes(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchMuertes();
  }, []);

  useEffect(() => {
    if (respuesta) fetchMuertes();
  }, [respuesta]);

  return (
    <div className="container">
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Edad:</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Causa de muerte:</label>
            <input
              type="text"
              value={causa}
              onChange={(e) => setCausa(e.target.value)}
              placeholder="Ataque al corazón"
            />
          </div>

          <div>
            <label className="upload-button">
              Cargar Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>
          </div>

          <button type="submit">Enviar</button>

          {error && <p className="error">{error}</p>}
          {respuesta && <h2 className="success">{respuesta}</h2>}
        </form>
      </div>

      <div className="deathnote-section">
        <div className="front-cover">
          <img src="/images/death-note.png" alt="Death Note Logo" />
        </div>

        <div className="content" contentEditable={false}>
          <p>{nombre}</p>
          <p>{edad}</p>
          <p>{causa}</p>
          {imageSrc && (
            <img src={imageSrc} alt="Uploaded" className="uploaded-image" />
          )}
        </div>
      </div>

      <div className="muertes-section">
        <h2>Personas registradas</h2>
        <ul>
          {muertes.map((muerte, index) => (
            <li key={index} className="muerte-item">
              <p><strong>{muerte.nombre}</strong> ({muerte.edad} años)</p>
              <p>{muerte.causa}</p>
              {muerte.imagen && (
                <img src={muerte.imagen} alt="Foto" className="muerte-foto" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
