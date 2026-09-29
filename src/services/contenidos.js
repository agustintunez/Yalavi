const API_URL = 'http://localhost/peliculas-api'

async function manejarRespuesta(respuesta) {
  if (respuesta.status === 204) return null

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    if (datos.errores) {
      throw new Error(datos.errores.join(' '))
    }

    throw new Error(datos.error || 'Error desconocido')
  }

  return datos
}

export async function listarContenidos() {
  const respuesta = await fetch(`${API_URL}/`)
  const datos = await manejarRespuesta(respuesta)

  return datos.map((item) => ({
    ...item,
    favorita: !!item.favorita,
  }))
}

export async function crearContenido(datos) {
  const respuesta = await fetch(`${API_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  return manejarRespuesta(respuesta)
}

export async function actualizarContenido(id, datos) {
  const respuesta = await fetch(`${API_URL}/?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  return manejarRespuesta(respuesta)
}

export async function borrarContenido(id) {
  const respuesta = await fetch(`${API_URL}/?id=${id}`, {
    method: 'DELETE',
  })

  return manejarRespuesta(respuesta)
}

export async function toggleFavorita(id, favorita) {
  const respuesta = await fetch(`${API_URL}/?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorita }),
  })

  return manejarRespuesta(respuesta)
}
