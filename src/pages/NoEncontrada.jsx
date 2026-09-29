import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <section className="no-encontrada">
      <p className="codigo" aria-hidden="true">
        404
      </p>
      <h1>Página no encontrada</h1>
      <p>La dirección que visitaste no corresponde a ninguna ruta de Yalavi.</p>
      <div className="botones">
        <Link to="/" className="boton boton-primario">
          Volver al inicio
        </Link>
        <Link to="/agregar" className="boton boton-secundario">
          + Agregar contenido
        </Link>
      </div>
    </section>
  )
}

export default NoEncontrada