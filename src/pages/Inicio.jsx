import useFiltrosContenidos from '../hooks/useFiltrosContenidos'
import ListaPorAnios from '../components/ListaPorAnios'
import BarraFiltros from '../components/BarraFiltros'
import EstadoVacio from '../components/EstadoVacio'
import SinResultados from '../components/SinResultados'

function Inicio({ contenidos, alAlternarFavorita, alEliminar }) {
  const { filtros, cambiarFiltro, limpiarFiltros, hayFiltros, anios, contenidosFiltrados } =
    useFiltrosContenidos(contenidos, { mostrarTipo: true })

  return (
    <section>
      <h1>Mi biblioteca</h1>
      <p className="subtitulo">
        {contenidos.length} {contenidos.length === 1 ? 'título registrado' : 'títulos registrados'}
      </p>

      <BarraFiltros
        filtros={filtros}
        cambiarFiltro={cambiarFiltro}
        limpiarFiltros={limpiarFiltros}
        hayFiltros={hayFiltros}
        anios={anios}
        mostrarTipo
      />

      {contenidos.length === 0 ? (
        <EstadoVacio
          titulo="Tu biblioteca está vacía"
          descripcion="Registrá tu primera película o serie para empezar a construir tu colección."
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

export default Inicio