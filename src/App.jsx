import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import Peliculas from './pages/Peliculas'
import Series from './pages/Series'
import Favoritos from './pages/Favoritos'
import Estadisticas from './pages/Estadisticas'
import Agregar from './pages/Agregar'
import Editar from './pages/Editar'
import NoEncontrada from './pages/NoEncontrada'
import {
  listarContenidos,
  crearContenido,
  actualizarContenido,
  borrarContenido,
  toggleFavorita,
} from './services/contenidos'

function App() {
  const [contenidos, setContenidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        setError(null)
        const datos = await listarContenidos()

        if (!cancelado) {
          setContenidos(datos)
        }
      } catch (e) {
        if (!cancelado) {
          setError(e.message)
        }
      } finally {
        if (!cancelado) {
          setCargando(false)
        }
      }
    }

    cargar()

    return () => {
      cancelado = true
    }
  }, [recarga])

  function recargar() {
    setRecarga((n) => n + 1)
  }

  async function agregarContenido(datos) {
    await crearContenido(datos)
    recargar()
  }

  async function editarContenido(id, datos) {
    await actualizarContenido(id, datos)
    recargar()
  }

  async function eliminarContenido(id) {
    await borrarContenido(id)
    recargar()
  }

  async function alternarFavorita(id) {
    const actual = contenidos.find((c) => c.id === id)
    await toggleFavorita(id, !actual.favorita)
    recargar()
  }

  return (
    <>
      <Navbar />

      <main className="contenedor pagina">
        {cargando && (
          <div className="estado-carga">
            <span className="spinner" aria-hidden="true" />
            <p>Cargando tu biblioteca...</p>
          </div>
        )}

        {error && (
          <div className="estado-error">
            <p>Error: {error}</p>
            <button
              type="button"
              className="boton boton-primario"
              onClick={() => {
                setCargando(true)
                setRecarga((n) => n + 1)
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <Routes>
            <Route
              path="/"
              element={
                <Inicio
                  contenidos={contenidos}
                  alAlternarFavorita={alternarFavorita}
                  alEliminar={eliminarContenido}
                />
              }
            />
            <Route
              path="/peliculas"
              element={
                <Peliculas
                  contenidos={contenidos}
                  alAlternarFavorita={alternarFavorita}
                  alEliminar={eliminarContenido}
                />
              }
            />
            <Route
              path="/series"
              element={
                <Series
                  contenidos={contenidos}
                  alAlternarFavorita={alternarFavorita}
                  alEliminar={eliminarContenido}
                />
              }
            />
            <Route
              path="/favoritos"
              element={
                <Favoritos
                  contenidos={contenidos}
                  alAlternarFavorita={alternarFavorita}
                  alEliminar={eliminarContenido}
                />
              }
            />
            <Route path="/estadisticas" element={<Estadisticas contenidos={contenidos} />} />
            <Route path="/agregar" element={<Agregar alAgregar={agregarContenido} />} />
            <Route
              path="/editar/:id"
              element={<Editar contenidos={contenidos} alGuardar={editarContenido} />}
            />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        )}
      </main>

      <footer className="pie">
        <div className="contenedor pie-inner">
          <span className="pie-marca">
            Ya<span>lavi</span>
          </span>
          <span>Tu registro personal de películas y series</span>
          <span className="pie-creditos">
            Powered by{' '}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
              The Movie Database (TMDB)
            </a>
          </span>
        </div>
      </footer>
    </>
  )
}

export default App