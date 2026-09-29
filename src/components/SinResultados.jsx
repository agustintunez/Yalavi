function IconoBusqueda() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 11h6" />
    </svg>
  )
}

function SinResultados({ alLimpiar }) {
  return (
    <div className="estado-vacio">
      <div className="estado-vacio-icono">
        <IconoBusqueda />
      </div>
      <h2>Sin resultados</h2>
      <p>No encontramos contenido que coincida con tu búsqueda o los filtros elegidos.</p>
      <button type="button" className="boton boton-secundario" onClick={alLimpiar}>
        Limpiar filtros
      </button>
    </div>
  )
}

export default SinResultados