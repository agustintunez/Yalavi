import { useMemo, useState } from 'react'

export const OPCIONES_ORDEN = [
  { valor: 'anio_desc', texto: 'Año visto (reciente)' },
  { valor: 'anio_asc', texto: 'Año visto (antiguo)' },
  { valor: 'puntuacion_desc', texto: 'Mejor puntuación' },
  { valor: 'puntuacion_asc', texto: 'Peor puntuación' },
  { valor: 'titulo', texto: 'Título (A-Z)' },
]

function filtrosIniciales() {
  return { busqueda: '', tipo: '', genero: '', anio: '', orden: 'anio_desc' }
}

function useFiltrosContenidos(base, { mostrarTipo = false } = {}) {
  const [filtros, setFiltros] = useState(filtrosIniciales)

  function cambiarFiltro(campo, valor) {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales())
  }

  const hayFiltros =
    filtros.busqueda !== '' ||
    filtros.tipo !== '' ||
    filtros.genero !== '' ||
    filtros.anio !== '' ||
    filtros.orden !== 'anio_desc'

  const anios = useMemo(() => {
    const set = new Set()
    base.forEach((contenido) => set.add(contenido.anio_visto))
    return [...set].sort((a, b) => b - a)
  }, [base])

  const contenidosFiltrados = useMemo(() => {
    const busqueda = filtros.busqueda.trim().toLowerCase()

    let resultado = base

    if (busqueda) {
      resultado = resultado.filter((contenido) =>
        contenido.titulo.toLowerCase().includes(busqueda),
      )
    }

    if (mostrarTipo && filtros.tipo) {
      resultado = resultado.filter((contenido) => contenido.tipo === filtros.tipo)
    }

    if (filtros.genero) {
      resultado = resultado.filter((contenido) => contenido.genero === filtros.genero)
    }

    if (filtros.anio) {
      resultado = resultado.filter((contenido) => contenido.anio_visto === Number(filtros.anio))
    }

    const ordenado = [...resultado]

    switch (filtros.orden) {
      case 'anio_asc':
        ordenado.sort((a, b) => a.anio_visto - b.anio_visto)
        break
      case 'puntuacion_desc':
        ordenado.sort((a, b) => (b.puntuacion ?? 0) - (a.puntuacion ?? 0))
        break
      case 'puntuacion_asc':
        ordenado.sort((a, b) => (a.puntuacion ?? 0) - (b.puntuacion ?? 0))
        break
      case 'titulo':
        ordenado.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))
        break
      default:
        ordenado.sort((a, b) => b.anio_visto - a.anio_visto)
    }

    return ordenado
  }, [base, filtros, mostrarTipo])

  return {
    filtros,
    cambiarFiltro,
    limpiarFiltros,
    hayFiltros,
    anios,
    contenidosFiltrados,
  }
}

export default useFiltrosContenidos