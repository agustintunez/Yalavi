import { Link } from 'react-router-dom'

function IconoFilm() {
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
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <path d="M7 2v20" />
      <path d="M17 2v20" />
      <path d="M2 12h20" />
      <path d="M2 7h3" />
      <path d="M2 17h3" />
      <path d="M19 7h3" />
      <path d="M19 17h3" />
    </svg>
  )
}

function EstadoVacio({ titulo, descripcion, mostrarCta = true }) {
  return (
    <div className="estado-vacio">
      <div className="estado-vacio-icono">
        <IconoFilm />
      </div>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      {mostrarCta && (
        <Link to="/agregar" className="boton boton-primario">
          + Agregar contenido
        </Link>
      )}
    </div>
  )
}

export default EstadoVacio