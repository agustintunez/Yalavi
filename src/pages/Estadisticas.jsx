import { useMemo } from 'react'
import EstadoVacio from '../components/EstadoVacio'

function agrupar(contenidos, campo, ascendente = false) {
  const grupos = contenidos.reduce((acumulador, item) => {
    acumulador[item[campo]] = (acumulador[item[campo]] || 0) + 1
    return acumulador
  }, {})

  return Object.entries(grupos)
    .map(([etiqueta, valor]) => ({ etiqueta, valor }))
    .sort((a, b) =>
      ascendente ? Number(a.etiqueta) - Number(b.etiqueta) : b.valor - a.valor
    )
}

function TarjetaKpi({ etiqueta, valor }) {
  return (
    <div className="kpi">
      <span className="kpi-valor">{valor}</span>
      <span className="kpi-etiqueta">{etiqueta}</span>
    </div>
  )
}

function GraficoBarras({ datos }) {
  const maximo = Math.max(...datos.map((dato) => dato.valor))

  return (
    <div className="grafico-barras">
      {datos.map((dato) => (
        <div className="grafico-fila" key={dato.etiqueta}>
          <span className="grafico-etiqueta">{dato.etiqueta}</span>
          <div className="grafico-pista">
            <div
              className="grafico-barra"
              style={{ width: `${(dato.valor / maximo) * 100}%` }}
            />
          </div>
          <span className="grafico-valor">{dato.valor}</span>
        </div>
      ))}
    </div>
  )
}

function TopPuntuados({ top }) {
  return (
    <ul className="lista-top">
      {top.map((item) => (
        <li key={item.id} className="top-item">
          {item.poster ? (
            <img
              className="top-poster"
              src={item.poster}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="top-poster top-sin-poster">
              {item.titulo.trim().charAt(0)}
            </span>
          )}
          <span className="top-info">
            <span className="top-titulo">{item.titulo}</span>
            <span className="top-meta">
              <span className={`etiqueta etiqueta-${item.tipo}`}>
                {item.tipo === 'pelicula' ? 'Película' : 'Serie'}
              </span>
              <span>{item.genero}</span>
              <span>{item.anio_visto}</span>
            </span>
          </span>
          <span className="top-puntuacion">{item.puntuacion}/10</span>
        </li>
      ))}
    </ul>
  )
}

function Estadisticas({ contenidos }) {
  const stats = useMemo(() => {
    const total = contenidos.length
    const peliculas = contenidos.filter((c) => c.tipo === 'pelicula').length
    const series = contenidos.filter((c) => c.tipo === 'serie').length
    const favoritas = contenidos.filter((c) => c.favorita).length

    const puntuados = contenidos.filter((c) => c.puntuacion)
    const promedio = puntuados.length
      ? (
          puntuados.reduce((suma, c) => suma + Number(c.puntuacion), 0) /
          puntuados.length
        ).toFixed(1)
      : null

    const porGenero = agrupar(contenidos, 'genero')
    const porAnioVisto = agrupar(contenidos, 'anio_visto', true)
    const mejorPuntuados = puntuados
      .slice()
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, 5)

    return {
      total,
      peliculas,
      series,
      favoritas,
      cantidadPuntuados: puntuados.length,
      promedio,
      porGenero,
      generoMasVisto: porGenero[0]?.etiqueta ?? null,
      porAnioVisto,
      mejorPuntuados,
    }
  }, [contenidos])

  if (contenidos.length === 0) {
    return (
      <section>
        <h1>Estadísticas</h1>
        <p className="subtitulo">Totales, promedios, género más visto y más.</p>
        <EstadoVacio
          titulo="Todavía no hay nada que medir"
          descripcion="Registrá tu primera película o serie y acá vas a ver tus números: promedios, géneros y tendencias."
        />
      </section>
    )
  }

  return (
    <section>
      <h1>Estadísticas</h1>
      <p className="subtitulo">Totales, promedios, género más visto y más.</p>

      <div className="grid-kpis">
        <TarjetaKpi etiqueta="Títulos" valor={stats.total} />
        <TarjetaKpi etiqueta="Películas" valor={stats.peliculas} />
        <TarjetaKpi etiqueta="Series" valor={stats.series} />
        <TarjetaKpi etiqueta="Favoritas" valor={stats.favoritas} />
      </div>

      <div className="promedio-tarjeta">
        {stats.promedio ? (
          <>
            <span className="promedio-numero">{stats.promedio}/10</span>
            <span className="promedio-texto">
              Puntuación promedio de {stats.cantidadPuntuados}{' '}
              {stats.cantidadPuntuados === 1 ? 'título puntuado' : 'títulos puntuados'}
            </span>
          </>
        ) : (
          <span className="promedio-texto">
            Puntuá algún título y acá va a aparecer tu promedio.
          </span>
        )}
      </div>

      {stats.porGenero.length > 0 && (
        <div className="seccion-stats">
          <h2>Géneros</h2>
          <p className="seccion-desc">
            Tu género más visto: <strong>{stats.generoMasVisto}</strong>
          </p>
          <GraficoBarras datos={stats.porGenero} />
        </div>
      )}

      <div className="seccion-stats">
        <h2>Historial por año</h2>
        <p className="seccion-desc">Cuántos títulos registraste cada año.</p>
        <GraficoBarras datos={stats.porAnioVisto} />
      </div>

      {stats.mejorPuntuados.length > 0 && (
        <div className="seccion-stats">
          <h2>Mejor puntuados</h2>
          <TopPuntuados top={stats.mejorPuntuados} />
        </div>
      )}
    </section>
  )
}

export default Estadisticas