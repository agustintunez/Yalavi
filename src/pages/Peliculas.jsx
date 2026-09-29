import useFiltrosContenidos from '../hooks/useFiltrosContenidos'
import ListaPorAnios from '../components/ListaPorAnios'
import BarraFiltros from '../components/BarraFiltros'
import EstadoVacio from '../components/EstadoVacio'
import SinResultados from '../components/SinResultados'

function Peliculas({ contenidos, alAlternarFavorita, alEliminar }) {
  const peliculas = contenidos.filter((contenido) => contenido.tipo === 'pelicula')

  const { filtros, cambiarFiltro, limpiarFiltros, hayFiltros, anios, contenidosFiltrados } =
    useFiltrosContenidos(peliculas)

  return (
    <section>
      <h1>Películas</h1>
      <p className="subtitulo">
        {peliculas.length} {peliculas.length === 1 ? 'película registrada' : 'películas registradas'}
      </p>

      <BarraFiltros
        filtros={filtros}
        cambiarFiltro={cambiarFiltro}
        limpiarFiltros={limpiarFiltros}
        hayFiltros={hayFiltros}
        anios={anios}
      />

      {peliculas.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no registraste películas"
          descripcion="Cuando agregues una película, la vas a ver acá."
        />
      ) : contenidosFiltrados.length === 0 ? (
        <SinResultados alLimpiar={limpiarFiltros} />
      ) : (
        <ListaPorAnios
          contenidos={contenidosFiltrados}
          alAlternarFavorita={alAlternarFavorita}
          alEliminar={alEliminar}
        />
      )}
    </section>
  )
}

export default Peliculas