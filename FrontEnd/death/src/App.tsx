import React, { useState } from "react";
import './App.css';

interface Muerte {
  nombre: string;
  edad: string;
  causa: string;
  imagen: string;
  horaRegistro: string;
  horaMuerte: string;
  estado: string;
}

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [causa, setCausa] = useState("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [muertes, setMuertes] = useState<Muerte[]>([]);

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

  const programarMuerte = (index: number, horaMuerte: Date) => {
    setTimeout(() => {
      setMuertes((prevMuertes) => {
        const nuevasMuertes = [...prevMuertes];
        nuevasMuertes[index].estado = `💀 Falleció a las ${horaMuerte.toLocaleTimeString()}`;
        return nuevasMuertes;
      });
    }, 40000); // 40 segundos
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRespuesta(null);

    if (!nombre || !edad || !file || !imageSrc) {
      setError("Debes ingresar nombre, edad y seleccionar una imagen.");
      return;
    }

    const ahora = new Date();
    const horaMuerte = new Date(ahora.getTime() + 40000); // +40s
    const nuevaMuerte: Muerte = {
      nombre,
      edad,
      causa: causa || "Ataque al corazón",
      imagen: imageSrc,
      horaRegistro: ahora.toLocaleString(),
      horaMuerte: horaMuerte.toLocaleTimeString(),
      estado: "🕒 Aún con vida",
    };

    const index = muertes.length;
    setMuertes([...muertes, nuevaMuerte]);
    setRespuesta("Registro de muerte exitoso.");

    programarMuerte(index, horaMuerte);

    // Limpiar formulario
    setNombre("");
    setEdad("");
    setCausa("");
    setFile(null);
    setImageSrc(null);
  };

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

      <div className="front-cover">
        <img src="/images/death-note.png" alt="Death Note Logo" />
      </div>

      {/* CUADERNO DE LA DEATH NOTE (última entrada) */}
      <div className="content" contentEditable={false}>
        <h3>Última entrada en el cuaderno</h3>
        <p> {nombre}</p>
        <p>{edad}</p>
        <p> {causa || "Ataque al corazón"}</p>
        {imageSrc && <img src={imageSrc} alt="Uploaded" className="uploaded-image" />}
      </div>

      {/* REGISTROS DE MUERTES */}
      <div className="death-log">
        <h3>Registros de muertes</h3>
        {muertes.map((muerte, index) => (
          <div key={index} className="death-entry">
            <img src={muerte.imagen} alt="Rostro" className="death-image" />
            <div className="death-details">
              <p><strong>Nombre:</strong> {muerte.nombre}</p>
              <p><strong>Edad:</strong> {muerte.edad}</p>
              <p><strong>Causa:</strong> {muerte.causa}</p>
              <p><strong>Registrado:</strong> {muerte.horaRegistro}</p>
              <p><strong>Muerte programada:</strong> {muerte.horaMuerte}</p>
              <p><strong>Estado:</strong> {muerte.estado}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

