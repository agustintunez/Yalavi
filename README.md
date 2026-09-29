# Yalavi

Tu registro personal de películas y series: catalogá lo que viste, puntualo, anotá tu opinión y mirá tus estadísticas. Las películas y series se buscan en TMDB y se rellenan solas (póster, género y año).

## Stack

- **Frontend**: React 19 + Vite + React Router
- **Backend**: PHP 8 + PDO
- **Base de datos**: MySQL (MariaDB, vía XAMPP)

## Características

- CRUD completo de películas y series
- Búsqueda de títulos en la API de TMDB con debounce, y autollenado del formulario (póster incluido)
- Búsqueda y filtros propios por año, tipo y favoritas
- Vista por año en la biblioteca
- Página de estadísticas: KPIs, promedios, géneros y gráficos
- Dark mode con marca propia

## Requisitos

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL/PHP)
- [pnpm](https://pnpm.io/) (o npm)
- Node.js 18+

## Puesta en marcha

1. **Base de datos**: importá `backend/database/peliculas.sql` en phpMyAdmin (crea la BD `peliculas_db` con la tabla `peliculas_series`).

2. **API**: copiá la carpeta `backend/api/` a `C:\xampp\htdocs\peliculas-api\` (o el equivalente en tu entorno) y arrancá Apache y MySQL desde el panel de XAMPP.

3. **Clave de TMDB** (opcional pero recomendado): registrate gratis en [themoviedb.org](https://www.themoviedb.org/), obtené una API key v3 y creá el archivo `backend/api/config.php` copiando `config.example.php` y reemplazando el placeholder:

   ```php
   <?php

   const TMDB_API_KEY = 'TU_KEY_AQUI';
   ```

   > Seguridad: `config.php` está en `.gitignore` para que la clave nunca se suba al repositorio.

4. **Frontend**:

   ```bash
   pnpm install
   pnpm dev
   ```

   Abrí `http://localhost:5173`. Si cambiás el puerto del dev server o de Apache, ajustá el `Access-Control-Allow-Origin` de `backend/api/db.php` y la constante `API_URL` de `src/services/`.

## Estructura

```
backend/
  api/            Endpoints PHP (CRUD + proxy de TMDB)
  database/       Esquema SQL
src/
  components/     Componentes de la interfaz
  constants/      Géneros posibles
  data/           Datos de prueba
  hooks/          Lógica de filtros
  pages/          Páginas (biblioteca, form, estadísticas, 404)
  services/       Clientes HTTP de la API y de TMDB
```

## API

Base en `http://localhost/peliculas-api/`:

| Método | Recurso        | Descripción                          |
|--------|----------------|--------------------------------------|
| GET    | `/index.php`   | Lista todo el contenido              |
| POST   | `/index.php`   | Crea un contenido                    |
| PUT    | `/index.php?id=` | Actualiza un contenido               |
| DELETE | `/index.php?id=` | Elimina un contenido                 |
| GET    | `/tmdb.php?q=` | Busca títulos en TMDB (proxy)        |

## Créditos

Powered by [The Movie Database (TMDB)](https://www.themoviedb.org/), usada bajo sus términos.