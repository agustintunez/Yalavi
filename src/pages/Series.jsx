import useFiltrosContenidos from '../hooks/useFiltrosContenidos'
import ListaPorAnios from '../components/ListaPorAnios'
import BarraFiltros from '../components/BarraFiltros'
import EstadoVacio from '../components/EstadoVacio'
import SinResultados from '../components/SinResultados'

function Series({ contenidos, alAlternarFavorita, alEliminar }) {
  const series = contenidos.filter((contenido) => contenido.tipo === 'serie')

  const { filtros, cambiarFiltro, limpiarFiltros, hayFiltros, anios, contenidosFiltrados } =
    useFiltrosContenidos(series)

  return (
    <section>
      <h1>Series</h1>
      <p className="subtitulo">
        {series.length} {series.length === 1 ? 'serie registrada' : 'series registradas'}
      </p>

      <BarraFiltros
        filtros={filtros}
        cambiarFiltro={cambiarFiltro}
        limpiarFiltros={limpiarFiltros}
        hayFiltros={hayFiltros}
        anios={anios}
      />

      {series.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no registraste series"
          descripcion="Cuando agregues una serie, la vas a ver acá."
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

export default Series