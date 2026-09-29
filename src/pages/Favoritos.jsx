import useFiltrosContenidos from '../hooks/useFiltrosContenidos'
import ListaPorAnios from '../components/ListaPorAnios'
import BarraFiltros from '../components/BarraFiltros'
import EstadoVacio from '../components/EstadoVacio'
import SinResultados from '../components/SinResultados'

function Favoritos({ contenidos, alAlternarFavorita, alEliminar }) {
  const favoritos = contenidos.filter((contenido) => contenido.favorita)

  const { filtros, cambiarFiltro, limpiarFiltros, hayFiltros, anios, contenidosFiltrados } =
    useFiltrosContenidos(favoritos, { mostrarTipo: true })

  return (
    <section>
      <h1>Favoritos</h1>
      <p className="subtitulo">
        {favoritos.length} {favoritos.length === 1 ? 'título marcado' : 'títulos marcados'} con
        estrella
      </p>

      <BarraFiltros
        filtros={filtros}
        cambiarFiltro={cambiarFiltro}
        limpiarFiltros={limpiarFiltros}
        hayFiltros={hayFiltros}
        anios={anios}
        mostrarTipo
      />

      {favoritos.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no marcaste favoritas"
          descripcion="Tocá la estrella en cualquier tarjeta para guardarla acá."
          mostrarCta={false}
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

export default Favoritos