import { useEffect, useState } from 'react'
import { buscarTitulos, urlPoster } from '../services/tmdb'

function IconoBusqueda() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function BuscadorTmdb({ alElegir }) {
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const texto = consulta.trim()

    if (texto.length < 2) {
      return undefined
    }

    let cancelado = false

    const temporizador = setTimeout(() => {
      setCargando(true)
      setError(null)
      setBuscado(false)

      buscarTitulos(texto)
        .then((datos) => {
          if (!cancelado) {
            setResultados(datos)
            setBuscado(true)
          }
        })
        .catch((e) => {
          if (!cancelado) {
            setError(e.message)
          }
        })
        .finally(() => {
          if (!cancelado) {
            setCargando(false)
          }
        })
    }, 400)

    return () => {
      cancelado = true
      clearTimeout(temporizador)
    }
  }, [consulta])

  function manejarCambio(evento) {
    const valor = evento.target.value
    setConsulta(valor)
    setResultados([])
    setBuscado(false)
    setError(null)

    if (valor.trim().length < 2) {
      setCargando(false)
    }
  }

  function seleccionar(resultado) {
    alElegir(resultado)
    setConsulta('')
    setResultados([])
    setBuscado(false)
    setError(null)
    setCargando(false)
  }

  const texto = consulta.trim()
  const esBusquedaValida = texto.length >= 2
  const sinResultados = buscado && !cargando && resultados.length === 0

  return (
    <div className="buscador-tmdb">
      <div className="campo">
        <label htmlFor="buscador-tmdb">¿Lo buscamos en TMDB?</label>
        <div className="barra-busqueda">
          <IconoBusqueda />
          <input
            id="buscador-tmdb"
            type="search"
            placeholder="Buscar película o serie..."
            value={consulta}
            onChange={manejarCambio}
            autoComplete="off"
          />
          {cargando && <span className="spinner-mini" aria-hidden="true" />}
        </div>
      </div>

      {error && (
        <p className="error-campo">
          No se pudo buscar: {error}. ¿Está corriendo XAMPP?
        </p>
      )}

      {esBusquedaValida && sinResultados && (
        <p className="buscador-tmdb-vacio">
          No encontramos &quot;{texto}&quot; en TMDB. Cargalo a mano abajo.
        </p>
      )}

      {esBusquedaValida && resultados.length > 0 && (
        <ul className="resultados-tmdb">
          {resultados.map((resultado) => (
            <li key={`${resultado.tipo}-${resultado.id}`}>
              <button
                type="button"
                className="resultado-tmdb"
                onClick={() => seleccionar(resultado)}
              >
                {urlPoster(resultado.poster_path, 92) ? (
                  <img
                    className="resultado-tmdb-poster"
                    src={urlPoster(resultado.poster_path, 92)}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="resultado-tmdb-poster resultado-tmdb-sin-poster">
                    {resultado.titulo.trim().charAt(0)}
                  </span>
                )}
                <span className="resultado-tmdb-info">
                  <span className="resultado-tmdb-titulo">{resultado.titulo}</span>
                  <span className="resultado-tmdb-meta">
                    <span className={`etiqueta etiqueta-${resultado.tipo}`}>
                      {resultado.tipo === 'pelicula' ? 'Película' : 'Serie'}
                    </span>
                    {resultado.anio && <span>{resultado.anio}</span>}
                    {resultado.generos[0] && <span>{resultado.generos[0]}</span>}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BuscadorTmdb