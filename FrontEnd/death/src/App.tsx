import React, { useEffect } from 'react';
import './App.css';
import deathNoteLogo from '..//images/death-note.png'; // Asegúrate de tener la imagen en esta ruta

const DeathNote: React.FC = () => {
  // Configuración de metadatos
  useEffect(() => {
    document.title = "Death Note App";
  }, []);

  return (
    <div className="deathnote-app">
      {/* Contenedor principal */}
      <div className="container">
        {/* Portada del Death Note */}
        <div className="front-cover">
          <img 
            src={deathNoteLogo} 
            alt="Death Note Logo" 
            className="logo-image"
          />
        </div>
        
        {/* Área de contenido editable con reglas iniciales */}
        <div 
          className="content"
          contentEditable
          suppressContentEditableWarning
        >
          <p>1. The human whose name is written in this note shall die.</p>
          <p>2. This note will not take effect unless the writer has the person's face in their mind.</p>
        </div>
      </div>
    </div>
  );
};

export default DeathNote;