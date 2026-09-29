const API_URL = 'http://localhost/peliculas-api'
const BASE_IMAGENES = 'https://image.tmdb.org/t/p'

export async function buscarTitulos(consulta) {
  const respuesta = await fetch(`${API_URL}/tmdb.php?q=${encodeURIComponent(consulta)}`)

  if (!respuesta.ok) {
    throw new Error('No se pudo buscar en TMDB')
  }

  return respuesta.json()
}

export function urlPoster(posterPath, tamano = 500) {
  if (!posterPath) return null
  return `${BASE_IMAGENES}/w${tamano}${posterPath}`
}