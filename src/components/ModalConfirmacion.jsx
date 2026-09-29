import { useEffect } from 'react'

function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar,
  textoCancelar,
  onConfirmar,
  onCancelar,
}) {
  useEffect(() => {
    if (!abierto) return undefined

    function manejarTecla(evento) {
      if (evento.key === 'Escape') {
        onCancelar()
      }
    }

    document.addEventListener('keydown', manejarTecla)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', manejarTecla)
      document.body.style.overflow = ''
    }
  }, [abierto, onCancelar])

  if (!abierto) return null

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h3 className="modal-titulo" id="modal-titulo">
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
          {titulo}
        </h3>
        <p className="modal-mensaje">{mensaje}</p>
        <div className="modal-acciones">
          <button type="button" className="boton boton-secundario" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className="boton boton-peligro" onClick={onConfirmar} autoFocus>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion