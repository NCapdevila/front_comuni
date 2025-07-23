import React, { useEffect, useState } from 'react';
import './index.css';
import VistaImagenes from './components/VistaImagenes';

function App() {
  const [carpetas, setCarpetas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);

  useEffect(() => {
    fetch('https://api.cebrokers.com.ar/carpetas')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.carpetas)) {
          setCarpetas(data.carpetas);
        }
      })
      .catch(console.error);
  }, []);

  const carpetasFiltradas = carpetas.filter(nombre =>
    nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (carpetaSeleccionada) {
    // Mostrar imágenes de la carpeta seleccionada
    return (
      <VistaImagenes
        carpeta={carpetaSeleccionada}
        onVolver={() => setCarpetaSeleccionada(null)}
      />
    );
  }

  // Mostrar lista de carpetas
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">ComunidAuto</h1>
      <input
        className="search-input"
        type="text"
        placeholder="Buscar patente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="folder-grid">
        {carpetasFiltradas.map((nombre) => (
          <div
            key={nombre}
            className="folder-item"
            style={{ cursor: 'pointer' }}
            onClick={() => setCarpetaSeleccionada(nombre)}
          >
            <div className="folder-icon">📂</div>
            <div className="folder-name">{nombre}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
