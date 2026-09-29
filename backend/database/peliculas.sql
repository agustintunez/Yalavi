CREATE DATABASE IF NOT EXISTS peliculas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE peliculas_db;

CREATE TABLE IF NOT EXISTS peliculas_series (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  tipo ENUM('pelicula', 'serie') NOT NULL,
  anio_estreno SMALLINT UNSIGNED NULL,
  anio_visto SMALLINT UNSIGNED NOT NULL,
  genero VARCHAR(100) NOT NULL,
  puntuacion TINYINT UNSIGNED NULL,
  opinion TEXT NULL,
  poster VARCHAR(500) NULL,
  favorita TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_puntuacion CHECK (puntuacion BETWEEN 1 AND 10)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
