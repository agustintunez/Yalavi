import { useState } from 'react'
import { GENEROS } from '../constants/generos'
import { urlPoster } from '../services/tmdb'
import BuscadorTmdb from './BuscadorTmdb'

const valoresPorDefecto = {
  titulo: '',
  tipo: '',
  anio_visto: '',
  anio_estreno: '',
  genero: '',
  puntuacion: '',
  opinion: '',
  poster: '',
  favorita: false,
}

function validar(formulario) {
  const errores = {}
  const anioActual = new Date().getFullYear()

  if (!formulario.titulo.trim()) {
    errores.titulo = 'El título es obligatorio.'
  }

  if (!formulario.tipo) {
    errores.tipo = 'Elegí si es película o serie.'
  }

  if (!formulario.anio_visto) {
    errores.anio_visto = 'El año en que lo viste es obligatorio.'
  } else {
    const anioVisto = Number(formulario.anio_visto)
    if (!Number.isInteger(anioVisto) || anioVisto < 1950 || anioVisto > anioActual + 1) {
      errores.anio_visto = `Debe ser un año entre 1950 y ${anioActual + 1}.`
    }
  }

  if (formulario.anio_estreno !== '') {
    const anioEstreno = Number(formulario.anio_estreno)
    if (!Number.isInteger(anioEstreno) || anioEstreno < 1888 || anioEstreno > anioActual + 2) {
      errores.anio_estreno = `Debe ser un año entre 1888 y ${anioActual + 2}.`
    }
  }

  if (!formulario.genero) {
    errores.genero = 'El género es obligatorio.'
  }

  if (formulario.puntuacion !== '') {
    const puntuacion = Number(formulario.puntuacion)
    if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 10) {
      errores.puntuacion = 'La puntuación debe ir de 1 a 10.'
    }
  }

  if (formulario.poster.trim() && !/^https?:\/\/.+/.test(formulario.poster.trim())) {
    errores.poster = 'Debe ser una URL que empiece con http:// o https://'
  }

  return errores
}

function IconoPelicula() {
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
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M10 7l6 3-6 3Z" />
    </svg>
  )
}

function IconoSerie() {
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
      <rect x="2" y="2" width="20" height="15" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  )
}

function MensajeError({ mensaje }) {
  if (!mensaje) return null
  return <p className="error-campo">{mensaje}</p>
}

function FormularioContenido({ valoresIniciales, textoBoton, alEnviar }) {
  const [formulario, setFormulario] = useState({
    ...valoresPorDefecto,
    ...valoresIniciales,
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [previewError, setPreviewError] = useState(false)

  function actualizarCampo(evento) {
    const { name, value, type, checked } = evento.target

    if (name === 'poster' && value !== formulario.poster) {
      setPreviewError(false)
    }

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function aplicarResultado(resultado) {
    setPreviewError(false)
    setErrores((anterior) => ({
      ...anterior,
      titulo: undefined,
      tipo: undefined,
      genero: undefined,
      poster: undefined,
    }))
    setFormulario((anterior) => ({
      ...anterior,
      titulo: resultado.titulo,
      tipo: resultado.tipo,
      anio_estreno: resultado.anio || '',
      genero: resultado.generos[0] || anterior.genero,
      poster: urlPoster(resultado.poster_path) || anterior.poster,
    }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()

    const erroresEncontrados = validar(formulario)
    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      return
    }

    setEnviando(true)
    setErrorGeneral(null)

    try {
      await alEnviar({
        ...formulario,
        titulo: formulario.titulo.trim(),
        poster: formulario.poster.trim(),
      })
    } catch (e) {
      setErrorGeneral(e.message)
    } finally {
      setEnviando(false)
    }
  }

  function claseInput(nombreCampo) {
    return errores[nombreCampo] ? 'input-error' : undefined
  }

  const enVistaPrevia = formulario.poster.trim() !== ''

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      {errorGeneral && <p className="error-general">{errorGeneral}</p>}

      <BuscadorTmdb alElegir={aplicarResultado} />

      <div className="campo">
        <label htmlFor="titulo">Título *</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          value={formulario.titulo}
          onChange={actualizarCampo}
          placeholder="Ej: Interstellar"
          className={claseInput('titulo')}
        />
        <MensajeError mensaje={errores.titulo} />
      </div>

      <div className="campo">
        <label>¿Qué es? *</label>
        <div
          role="radiogroup"
          aria-label="Tipo de contenido"
          className={`segmento${errores.tipo ? ' input-error' : ''}`}
        >
          <label className={formulario.tipo === 'pelicula' ? 'segmento-opcion activa' : 'segmento-opcion'}>
            <input
              type="radio"
              name="tipo"
              value="pelicula"
              checked={formulario.tipo === 'pelicula'}
              onChange={actualizarCampo}
            />
            <IconoPelicula />
            Película
          </label>
          <label className={formulario.tipo === 'serie' ? 'segmento-opcion activa' : 'segmento-opcion'}>
            <input
              type="radio"
              name="tipo"
              value="serie"
              checked={formulario.tipo === 'serie'}
              onChange={actualizarCampo}
            />
            <IconoSerie />
            Serie
          </label>
        </div>
        <MensajeError mensaje={errores.tipo} />
      </div>

      <div className="fila-campos">
        <div className="campo">
          <label htmlFor="genero">Género *</label>
          <select
            id="genero"
            name="genero"
            value={formulario.genero}
            onChange={actualizarCampo}
            className={claseInput('genero')}
          >
            <option value="">Elegir...</option>
            {GENEROS.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
          <MensajeError mensaje={errores.genero} />
        </div>

        <div className="campo">
          <label htmlFor="puntuacion">Puntuación (1-10)</label>
          <select
            id="puntuacion"
            name="puntuacion"
            value={formulario.puntuacion}
            onChange={actualizarCampo}
            className={claseInput('puntuacion')}
          >
            <option value="">Sin puntuar</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((numero) => (
              <option key={numero} value={numero}>
                {numero}/10
              </option>
            ))}
          </select>
          <MensajeError mensaje={errores.puntuacion} />
        </div>
      </div>

      <div className="fila-campos">
        <div className="campo">
          <label htmlFor="anio_visto">Año en que lo viste *</label>
          <input
            id="anio_visto"
            name="anio_visto"
            type="number"
            value={formulario.anio_visto}
            onChange={actualizarCampo}
            placeholder="Ej: 2026"
            className={claseInput('anio_visto')}
          />
          <MensajeError mensaje={errores.anio_visto} />
        </div>

        <div className="campo">
          <label htmlFor="anio_estreno">Año de estreno</label>
          <input
            id="anio_estreno"
            name="anio_estreno"
            type="number"
            value={formulario.anio_estreno}
            onChange={actualizarCampo}
            placeholder="Opcional"
            className={claseInput('anio_estreno')}
          />
          <MensajeError mensaje={errores.anio_estreno} />
        </div>
      </div>

      <div className="campo">
        <label htmlFor="poster">URL del póster</label>
        <input
          id="poster"
          name="poster"
          type="url"
          value={formulario.poster}
          onChange={actualizarCampo}
          placeholder="https://..."
          className={claseInput('poster')}
        />
        <MensajeError mensaje={errores.poster} />

        {enVistaPrevia && (
          <div className="preview-poster">
            {previewError ? (
              <span className="preview-error">
                No se pudo cargar la imagen desde esa URL. Verificá el enlace.
              </span>
            ) : (
              <img
                src={formulario.poster.trim()}
                alt={`Vista previa del póster de ${formulario.titulo || 'contenido'}`}
                onError={() => setPreviewError(true)}
              />
            )}
          </div>
        )}
      </div>

      <div className="campo">
        <label htmlFor="opinion">Opinión personal</label>
        <textarea
          id="opinion"
          name="opinion"
          rows="4"
          value={formulario.opinion}
          onChange={actualizarCampo}
          placeholder="Qué te pareció..."
        />
      </div>

      <label className="interruptor-fila">
        <input
          type="checkbox"
          name="favorita"
          checked={formulario.favorita}
          onChange={actualizarCampo}
        />
        <span className="interruptor-pista" aria-hidden="true">
          <span className="interruptor-perilla" />
        </span>
        Marcar como favorita
      </label>

      <button type="submit" className="boton boton-primario" disabled={enviando}>
        {enviando ? 'Guardando...' : textoBoton}
      </button>
    </form>
  )
}

export default FormularioContenido