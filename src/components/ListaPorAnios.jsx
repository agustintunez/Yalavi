import TarjetaContenido from './TarjetaContenido'

function agruparPorAnio(contenidos) {
  const grupos = {}

  contenidos.forEach((contenido) => {
    const anio = contenido.anio_visto

    if (!grupos[anio]) {
      grupos[anio] = []
    }

    grupos[anio].push(contenido)
  })

  return Object.entries(grupos).sort((a, b) => b[0] - a[0])
}

function ListaPorAnios({ contenidos, alAlternarFavorita, alEliminar }) {
  const grupos = agruparPorAnio(contenidos)

  if (grupos.length === 0) {
    return <p className="vacio">Todavía no registraste nada.</p>
  }

  return (
    <div className="lista-anios">
      {grupos.map(([anio, items]) => (
        <section key={anio} className="grupo-anio">
          <h2 className="titulo-anio">
            {anio}
            <span className="contador-anio">
              {items.length} {items.length === 1 ? 'título' : 'títulos'}
            </span>
          </h2>

          <div className="grilla-contenidos">
            {items.map((contenido) => (
              <TarjetaContenido
                key={contenido.id}
                contenido={contenido}
                alAlternarFavorita={alAlternarFavorita}
                alEliminar={alEliminar}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default ListaPorAnios
