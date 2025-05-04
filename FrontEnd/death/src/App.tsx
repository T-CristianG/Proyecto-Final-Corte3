import React, { useState } from "react";
import './App.css';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div className="front-cover">
        <img src="/images/death-note.png" alt="Death Note Logo" />
      </div>
      <div className="content" contentEditable={true}>
        {imageSrc && <img src={imageSrc} alt="Uploaded" className="uploaded-image" />}
      </div>
      <label className="upload-button">
        Cargar Foto
        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
      </label>
    </div>
  );
};

export default App;
