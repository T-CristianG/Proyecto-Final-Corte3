import React from "react";

const App: React.FC = () => {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "#f4e0c5",
      border: "5px solid #964b00",
      padding: "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1 style={{ textAlign: "center", fontSize: "3rem" }}>El Gran Viaje</h1>
      <p style={{ fontSize: "1.5rem", textAlign: "justify", maxWidth: "80%" }}>
        En un mundo desconocido, un aventurero busca respuestas que cambiarán su destino para siempre...
      </p>
    </div>
  );
};

export default App;

