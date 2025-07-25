import React, { useEffect, useState } from 'react';

function VistaImagenes({ carpeta, onVolver }) {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    if (!carpeta) return;

    setCargando(true);
    setError(null);

    fetch(`https://api.cebrokers.com.ar/fotos/${carpeta}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar imágenes');
        return res.json();
      })
      .then((data) => setImagenes(data.archivos || []))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [carpeta]);

  const esImagen = (nombre) => /\.(jpe?g|png|gif|bmp|webp)$/i.test(nombre);
  const esPDF = (nombre) => /\.pdf$/i.test(nombre);

  const abrirModal = (index) => setModalIndex(index);
  const cerrarModal = () => setModalIndex(null);
  const siguiente = () => setModalIndex((modalIndex + 1) % imagenes.length);
  const anterior = () => setModalIndex((modalIndex - 1 + imagenes.length) % imagenes.length);

  useEffect(() => {
    const manejarTecla = (e) => {
      if (modalIndex === null) return;
      if (e.key === 'ArrowRight') siguiente();
      if (e.key === 'ArrowLeft') anterior();
      if (e.key === 'Escape') cerrarModal();
    };
    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [modalIndex]);

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: '0 15px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: 20 }}>
        <strong>{carpeta}</strong>
      </h2>

      {cargando && <div className="spinner" />}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 180px)',
          gap: 50,
          justifyContent: 'center',
          flexWrap: 'center',
        }}
      >
        {imagenes.map((archivo, i) => {
          const url = `https://api.cebrokers.com.ar/uploads/${carpeta}/${archivo}`;

          if (esImagen(archivo)) {
            return (
              <div
                key={i}
                onClick={() => abrirModal(i)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  width: '180px',
                  height: '180px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={url}
                  alt={archivo}
                  style={{ 
                    width: '100%',
                    borderRadius: 6, 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </div>
            );
          }

          if (esPDF(archivo)) {
            return (
              <a
                key={i}
                href={url}
                download={archivo}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: '#333',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="PDF Icon"
                  style={{ width: 40, marginBottom: 8 }}
                />
                <span style={{ fontSize: 14, textAlign: 'center', wordBreak: 'break-word' }}>{archivo}</span>
              </a>
            );
          }

          return null;
        })}
      </div>

      <button
        onClick={onVolver}
        style={{
          marginTop: 30,
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        ← Volver
      </button>

      {modalIndex !== null && (
        <div
          onClick={cerrarModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '60vw',
              height: '60vh',
              backgroundColor: 'white',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={`https://api.cebrokers.com.ar/uploads/${carpeta}/${imagenes[modalIndex]}`}
              alt=""
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            {/* Botón anterior */}
            <button
              onClick={anterior}
              style={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                fontSize: 30,
                color: '#333',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ‹
            </button>
            {/* Botón siguiente */}
            <button
              onClick={siguiente}
              style={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                fontSize: 30,
                color: '#333',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ›
            </button>
            {/* Botón cerrar */}
            <button
              onClick={cerrarModal}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontSize: 20,
                color: '#333',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VistaImagenes;
