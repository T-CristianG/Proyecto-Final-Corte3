import React, { useState, useEffect } from "react";
import "./App.css";

const App: React.FC = () => {
  // Estados originales
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [causa, setCausa] = useState("");
  const [error, setError] = useState<string>("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [muertes, setMuertes] = useState<any[]>([]);

  // Estados para los contadores y detalles adicionales
  const [causeTimer, setCauseTimer] = useState(40);
  const [detalles, setDetalles] = useState("");
  const [detailsTimer, setDetailsTimer] = useState(400);
  const [finalTimer, setFinalTimer] = useState(40);
  const [finalCountdownStarted, setFinalCountdownStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Manejo de carga de imagen (sin cambios)
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

  // CONTADOR PARA INGRESAR LA CAUSA (40 segundos)
  // Se activa si hay nombre, edad y foto, y la causa sigue vacía.
  useEffect(() => {
    if (!submitted && nombre && edad && file && !causa) {
      const interval = setInterval(() => {
        setCauseTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Al expirar el tiempo, se asigna el valor por defecto y se auto-envía
            setCausa("Ataque al corazón");
            handleSubmitFinal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [submitted, nombre, edad, file, causa]);

  // CONTADOR PARA INGRESAR DETALLES (400 segundos)
  // Se activa si se ingresó una causa distinta a "Ataque al corazón" y aún no se han escrito detalles.
  useEffect(() => {
    if (
      !submitted &&
      causa &&
      causa.toLowerCase() !== "ataque al corazón" &&
      detalles === ""
    ) {
      const interval = setInterval(() => {
        setDetailsTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Si se agota este tiempo, se termina el timer sin tomar otra acción
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [submitted, causa, detalles]);

  // Dispara el inicio del contador final de 40 segundos cuando se comienza a escribir en detalles
  useEffect(() => {
    if (!submitted && detalles.trim() !== "" && !finalCountdownStarted) {
      setFinalCountdownStarted(true);
    }
  }, [submitted, detalles, finalCountdownStarted]);

  // CONTADOR FINAL DE 40 SEGUNDOS
  // Se activa cuando finalCountdownStarted es true y decrementa el contador cada segundo.
  useEffect(() => {
    if (!submitted && finalCountdownStarted) {
      const interval = setInterval(() => {
        setFinalTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [finalCountdownStarted, submitted]);

  // Cuando finalTimer llega a 0, se envía automáticamente el formulario.
  useEffect(() => {
    if (!submitted && finalCountdownStarted && finalTimer <= 0) {
      handleSubmitFinal();
    }
  }, [finalTimer, finalCountdownStarted, submitted]);

  // Función para el envío (auto o manual) del formulario
  const handleSubmitFinal = async () => {
    if (submitted) return; // Evita envíos duplicados

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
    // Incluimos detalles solo si la causa es personalizada
    if (causa && causa.toLowerCase() !== "ataque al corazón") {
      formData.append("detalles", detalles);
    }
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
      setSubmitted(true);
      // Reiniciamos todos los estados y contadores para permitir un nuevo registro
      setNombre("");
      setEdad("");
      setCausa("");
      setDetalles("");
      setFile(null);
      setImageSrc(null);
      setCauseTimer(40);
      setDetailsTimer(400);
      setFinalTimer(40);
      setFinalCountdownStarted(false);
      setSubmitted(false);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud");
      console.error(err);
    }
  };

  // Envío manual del formulario (al presionar el botón)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;

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
    if (causa && causa.toLowerCase() !== "ataque al corazón") {
      formData.append("detalles", detalles);
    }
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
      setSubmitted(true);
      setNombre("");
      setEdad("");
      setCausa("");
      setDetalles("");
      setFile(null);
      setImageSrc(null);
      // Reiniciamos los contadores
      setCauseTimer(40);
      setDetailsTimer(400);
      setFinalTimer(40);
      setFinalCountdownStarted(false);
      setSubmitted(false);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud");
      console.error(err);
    }
  };

  // Función para obtener las "muertes" registradas
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
      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Edad:</label>
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          />

          <label>Causa de muerte:</label>
          <input
            type="text"
            value={causa}
            onChange={(e) => setCausa(e.target.value)}
            placeholder="Ataque al corazón"
          />

          {/* Muestra el contador para la causa si aún no se ha escrito */}
          {nombre && !causa && (
            <p>
              Tiempo restante para registrar la causa:{" "}
              <strong>{causeTimer}</strong> segundos
            </p>
          )}

          {/* Si se ingresa una causa distinta a "Ataque al corazón", se muestran los detalles */}
          {causa && causa.toLowerCase() !== "ataque al corazón" && (
            <>
              <label>Detalles específicos:</label>
              <textarea
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                placeholder="Escribe los detalles específicos"
              />
              {!detalles && (
                <p>
                  Tiempo restante para ingresar detalles:{" "}
                  <strong>{detailsTimer}</strong> segundos
                </p>
              )}
              {finalCountdownStarted && (
                <p>
                  El registro se enviará en{" "}
                  <strong>{finalTimer}</strong> segundos
                </p>
              )}
            </>
          )}

          <label className="file-button">
            Cargar Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>

          <button type="submit">Enviar</button>

          {error && <p className="error">{error}</p>}
          {respuesta && <p className="success">{respuesta}</p>}
        </form>
      </div>

      <div className="libros">
        <div className="libro-negro">
          <img src="/images/death-note.png" alt="Death Note Logo" />
        </div>

        <div className="libro-blanco">
          <p>{nombre}</p>
          <p>{edad}</p>
          <p>{causa}</p>
          {imageSrc && <img src={imageSrc} alt="Uploaded" />}
        </div>
      </div>

      <div className="muertes">
        <h2>Personas registradas</h2>
        <ul>
          {muertes.map((muerte, index) => (
            <li key={index}>
              <p>
                <strong>{muerte.nombre}</strong> ({muerte.edad} años)
              </p>
              <p>{muerte.causa}</p>
              {muerte.imagen && <img src={muerte.imagen} alt="Foto" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
