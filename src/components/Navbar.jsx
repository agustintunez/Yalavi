import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const secciones = [
  { to: '/', texto: 'Inicio', exacta: true },
  { to: '/peliculas', texto: 'Películas' },
  { to: '/series', texto: 'Series' },
  { to: '/favoritos', texto: 'Favoritos' },
  { to: '/estadisticas', texto: 'Estadísticas' },
]

function Navbar() {
  const [abierto, setAbierto] = useState(false)

  function cerrar() {
    setAbierto(false)
  }

  return (
    <header className="navbar">
      <div className="contenedor navbar-inner">
        <Link to="/" className="logo" onClick={cerrar}>
          Ya<span>lavi</span>
        </Link>

        <nav
          id="menu-principal"
          className={`nav-links${abierto ? ' abierto' : ''}`}
          aria-label="Navegación principal"
        >
          {secciones.map((seccion) => (
            <NavLink
              key={seccion.to}
              to={seccion.to}
              end={seccion.exacta}
              onClick={cerrar}
              className={({ isActive }) => (isActive ? 'activo' : undefined)}
            >
              {seccion.texto}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={`boton-menu${abierto ? ' abierto' : ''}`}
          onClick={() => setAbierto((valor) => !valor)}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          aria-controls="menu-principal"
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/agregar" className="boton-agregar" onClick={cerrar}>
          + Agregar
        </Link>
      </div>
    </header>
  )
}

export default Navbar