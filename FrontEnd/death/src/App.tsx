import React from "react";

import './App.css';

const App: React.FC = () => {
  return (
    <div className="container">
      <div className="front-cover">
        <img src="../../images/death-note.png" alt="Death Note Logo" />
      </div>
      <div className="content" contentEditable={true}></div>
    </div>
  );
};

export default App;