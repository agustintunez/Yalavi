import { GENEROS } from '../constants/generos'
import { OPCIONES_ORDEN } from '../hooks/useFiltrosContenidos'

function IconoBusqueda() {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function IconoLimpiar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function BarraFiltros({
  filtros,
  cambiarFiltro,
  limpiarFiltros,
  hayFiltros,
  anios,
  mostrarTipo,
}) {
  function cambiar(campo) {
    return (evento) => cambiarFiltro(campo, evento.target.value)
  }

  return (
    <div className="barra-filtros" role="search">
      <div className="barra-busqueda">
        <IconoBusqueda />
        <input
          type="search"
          aria-label="Buscar por título"
          placeholder="Buscar por título..."
          value={filtros.busqueda}
          onChange={cambiar('busqueda')}
        />
      </div>

      {mostrarTipo && (
        <select aria-label="Filtrar por tipo" value={filtros.tipo} onChange={cambiar('tipo')}>
          <option value="">Todos los tipos</option>
          <option value="pelicula">Películas</option>
          <option value="serie">Series</option>
        </select>
      )}

      <select aria-label="Filtrar por género" value={filtros.genero} onChange={cambiar('genero')}>
        <option value="">Todos los géneros</option>
        {GENEROS.map((genero) => (
          <option key={genero} value={genero}>
            {genero}
          </option>
        ))}
      </select>

      <select aria-label="Filtrar por año" value={filtros.anio} onChange={cambiar('anio')}>
        <option value="">Todos los años</option>
        {anios.map((anio) => (
          <option key={anio} value={anio}>
            {anio}
          </option>
        ))}
      </select>

      <select aria-label="Ordenar resultados" value={filtros.orden} onChange={cambiar('orden')}>
        {OPCIONES_ORDEN.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>

      {hayFiltros && (
        <button type="button" className="boton-limpiar" onClick={limpiarFiltros}>
          <IconoLimpiar />
          Limpiar
        </button>
      )}
    </div>
  )
}

export default BarraFiltros