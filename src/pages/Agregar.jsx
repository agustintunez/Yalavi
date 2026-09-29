import { useNavigate } from 'react-router-dom'
import FormularioContenido from '../components/FormularioContenido'

function Agregar({ alAgregar }) {
  const navegar = useNavigate()

  async function manejarAlEnviar(datos) {
    await alAgregar(datos)
    navegar('/')
  }

  return (
    <section>
      <h1>Agregar contenido</h1>
      <p className="subtitulo">Registrá una película o serie que ya viste.</p>

      <FormularioContenido textoBoton="Agregar" alEnviar={manejarAlEnviar} />
    </section>
  )
}

export default Agregar
