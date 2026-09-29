import { Link, useNavigate, useParams } from 'react-router-dom'
import FormularioContenido from '../components/FormularioContenido'

function Editar({ contenidos, alGuardar }) {
  const { id } = useParams()
  const navegar = useNavigate()

  const contenido = contenidos.find((item) => item.id === Number(id))

  if (!contenido) {
    return (
      <section>
        <h1>Contenido no encontrado</h1>
        <p>No existe nada con ID {id} en tu biblioteca.</p>
        <p>
          <Link to="/" className="enlace">
            Volver al inicio
          </Link>
        </p>
      </section>
    )
  }

  async function manejarAlEnviar(datos) {
    await alGuardar(contenido.id, datos)
    navegar('/')
  }

  return (
    <section>
      <h1>Editar contenido</h1>
      <p className="subtitulo">Modificando "{contenido.titulo}"</p>

      <FormularioContenido
        valoresIniciales={{
          titulo: contenido.titulo,
          tipo: contenido.tipo,
          anio_visto: String(contenido.anio_visto),
          anio_estreno:
            contenido.anio_estreno === null || contenido.anio_estreno === undefined
              ? ''
              : String(contenido.anio_estreno),
          genero: contenido.genero,
          puntuacion: contenido.puntuacion ? String(contenido.puntuacion) : '',
          opinion: contenido.opinion ?? '',
          poster: contenido.poster ?? '',
          favorita: Boolean(contenido.favorita),
        }}
        textoBoton="Guardar cambios"
        alEnviar={manejarAlEnviar}
      />
    </section>
  )
}

export default Editar
