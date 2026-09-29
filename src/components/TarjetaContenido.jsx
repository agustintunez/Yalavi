import { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalConfirmacion from './ModalConfirmacion'

function colorPuntuacion(puntuacion) {
  if (puntuacion >= 8) return 'alta'
  if (puntuacion >= 6) return 'media'
  return 'baja'
}

function IconoEstrella() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

function IconoEditar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  )
}

function IconoEliminar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function IconoFilm() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
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

function TarjetaContenido({ contenido, alAlternarFavorita, alEliminar }) {
  const { id, titulo, tipo, anio_estreno, genero, puntuacion, poster, favorita } = contenido
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false)

  const clasePuntuacion = puntuacion
    ? `puntuacion puntuacion-${colorPuntuacion(puntuacion)}`
    : 'puntuacion puntuacion-sin-puntuar'

  return (
    <>
      <article className="tarjeta">
        <div className="tarjeta-poster-contenedor">
          {poster ? (
            <img
              src={poster}
              alt={`Póster de ${titulo}`}
              className="tarjeta-poster"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="tarjeta-poster tarjeta-sin-poster"
              aria-label={`Sin póster de ${titulo}`}
            >
              <span className="sin-poster-icono">
                <IconoFilm />
              </span>
              <span className="sin-poster-inicial">{titulo.charAt(0).toUpperCase()}</span>
              <span className="sin-poster-texto">Sin póster</span>
            </div>
          )}

          <div className="tarjeta-gradiente" aria-hidden="true" />

          <div className="tarjeta-puntaje">
            <span className={clasePuntuacion}>{puntuacion ? `${puntuacion}/10` : '—'}</span>
          </div>

          <button
            type="button"
            className={favorita ? 'boton-estrella activa' : 'boton-estrella'}
            onClick={() => alAlternarFavorita(id)}
            title={favorita ? 'Quitar de favoritas' : 'Marcar como favorita'}
            aria-label={
              favorita ? `Quitar "${titulo}" de favoritas` : `Marcar "${titulo}" como favorita`
            }
            aria-pressed={favorita}
          >
            <IconoEstrella />
          </button>

          <div className="tarjeta-info">
            <div className="tarjeta-acciones">
              <Link to={`/editar/${id}`} className="accion-editar" aria-label={`Editar ${titulo}`}>
                <IconoEditar />
                Editar
              </Link>
              <button
                type="button"
                className="accion-eliminar"
                onClick={() => setConfirmandoEliminar(true)}
                aria-label={`Eliminar ${titulo}`}
              >
                <IconoEliminar />
                Eliminar
              </button>
            </div>

            <h3 className="tarjeta-titulo">{titulo}</h3>

            <div className="tarjeta-detalles">
              <span className={`etiqueta etiqueta-${tipo}`}>
                {tipo === 'pelicula' ? 'Película' : 'Serie'}
              </span>
              <span>{anio_estreno}</span>
              <span>{genero}</span>
            </div>
          </div>
        </div>
      </article>

      <ModalConfirmacion
        abierto={confirmandoEliminar}
        titulo="Eliminar contenido"
        mensaje={`¿Seguro que querés eliminar "${titulo}" de tu biblioteca? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        onConfirmar={() => {
          setConfirmandoEliminar(false)
          alEliminar(id)
        }}
        onCancelar={() => setConfirmandoEliminar(false)}
      />
    </>
  )
}

export default TarjetaContenido