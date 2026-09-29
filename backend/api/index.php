<?php

require __DIR__ . '/db.php';

function validarContenido($datos)
{
    $errores = [];
    $anioActual = date('Y');

    if (empty(trim($datos['titulo'] ?? ''))) {
        $errores[] = 'El título es obligatorio.';
    }

    if (!in_array($datos['tipo'] ?? '', ['pelicula', 'serie'])) {
        $errores[] = 'El tipo debe ser película o serie.';
    }

    $anioVisto = intval($datos['anio_visto'] ?? 0);
    if ($anioVisto < 1950 || $anioVisto > $anioActual + 1) {
        $errores[] = 'El año visto no es válido.';
    }

    if (empty(trim($datos['genero'] ?? ''))) {
        $errores[] = 'El género es obligatorio.';
    }

    $puntuacion = intval($datos['puntuacion'] ?? 0);
    if ($puntuacion !== 0 && ($puntuacion < 1 || $puntuacion > 10)) {
        $errores[] = 'La puntuación debe ir de 1 a 10.';
    }

    $poster = trim($datos['poster'] ?? '');
    if ($poster !== '' && !preg_match('#^https?://#', $poster)) {
        $errores[] = 'La URL del póster debe empezar con http:// o https://';
    }

    return $errores;
}

$metodo = $_SERVER['REQUEST_METHOD'];
$conexion = obtenerConexion();

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            $consulta = $conexion->prepare('SELECT * FROM peliculas_series WHERE id = :id');
            $consulta->execute([':id' => $_GET['id']]);
            $contenido = $consulta->fetch();

            if ($contenido) {
                echo json_encode($contenido, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No existe contenido con ese ID'], JSON_UNESCAPED_UNICODE);
            }
        } else {
            $resultado = $conexion->query('SELECT * FROM peliculas_series ORDER BY anio_visto DESC');
            echo json_encode($resultado->fetchAll(), JSON_UNESCAPED_UNICODE);
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);

        if (!is_array($datos)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos'], JSON_UNESCAPED_UNICODE);
            break;
        }

        $errores = validarContenido($datos);

        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['errores' => $errores], JSON_UNESCAPED_UNICODE);
            break;
        }

        $consulta = $conexion->prepare(
            'INSERT INTO peliculas_series (titulo, tipo, anio_estreno, anio_visto, genero, puntuacion, opinion, poster, favorita)
             VALUES (:titulo, :tipo, :anio_estreno, :anio_visto, :genero, :puntuacion, :opinion, :poster, :favorita)'
        );
        $consulta->execute([
            ':titulo' => trim($datos['titulo']),
            ':tipo' => $datos['tipo'],
            ':anio_estreno' => !empty($datos['anio_estreno']) ? intval($datos['anio_estreno']) : null,
            ':anio_visto' => intval($datos['anio_visto']),
            ':genero' => $datos['genero'],
            ':puntuacion' => !empty($datos['puntuacion']) ? intval($datos['puntuacion']) : null,
            ':opinion' => !empty($datos['opinion']) ? $datos['opinion'] : null,
            ':poster' => !empty($datos['poster']) ? trim($datos['poster']) : null,
            ':favorita' => !empty($datos['favorita']) ? 1 : 0,
        ]);

        $id = $conexion->lastInsertId();
        $consultaItem = $conexion->prepare('SELECT * FROM peliculas_series WHERE id = :id');
        $consultaItem->execute([':id' => $id]);

        http_response_code(201);
        echo json_encode($consultaItem->fetch(), JSON_UNESCAPED_UNICODE);
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el ID del contenido'], JSON_UNESCAPED_UNICODE);
            break;
        }

        $id = intval($_GET['id']);
        $datos = json_decode(file_get_contents('php://input'), true);

        if (!is_array($datos)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos'], JSON_UNESCAPED_UNICODE);
            break;
        }

        $check = $conexion->prepare('SELECT id FROM peliculas_series WHERE id = :id');
        $check->execute([':id' => $id]);

        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'No existe contenido con ese ID'], JSON_UNESCAPED_UNICODE);
            break;
        }

        if (array_key_exists('favorita', $datos) && count($datos) === 1) {
            $consulta = $conexion->prepare('UPDATE peliculas_series SET favorita = :favorita WHERE id = :id');
            $consulta->execute([':favorita' => $datos['favorita'] ? 1 : 0, ':id' => $id]);
        } else {
            $errores = validarContenido($datos);

            if (!empty($errores)) {
                http_response_code(400);
                echo json_encode(['errores' => $errores], JSON_UNESCAPED_UNICODE);
                break;
            }

            $consulta = $conexion->prepare(
                'UPDATE peliculas_series
                 SET titulo = :titulo, tipo = :tipo, anio_estreno = :anio_estreno,
                     anio_visto = :anio_visto, genero = :genero, puntuacion = :puntuacion,
                     opinion = :opinion, poster = :poster, favorita = :favorita
                 WHERE id = :id'
            );
            $consulta->execute([
                ':titulo' => trim($datos['titulo']),
                ':tipo' => $datos['tipo'],
                ':anio_estreno' => !empty($datos['anio_estreno']) ? intval($datos['anio_estreno']) : null,
                ':anio_visto' => intval($datos['anio_visto']),
                ':genero' => $datos['genero'],
                ':puntuacion' => !empty($datos['puntuacion']) ? intval($datos['puntuacion']) : null,
                ':opinion' => !empty($datos['opinion']) ? $datos['opinion'] : null,
                ':poster' => !empty($datos['poster']) ? trim($datos['poster']) : null,
                ':favorita' => !empty($datos['favorita']) ? 1 : 0,
                ':id' => $id,
            ]);
        }

        $consultaItem = $conexion->prepare('SELECT * FROM peliculas_series WHERE id = :id');
        $consultaItem->execute([':id' => $id]);
        echo json_encode($consultaItem->fetch(), JSON_UNESCAPED_UNICODE);
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el ID del contenido'], JSON_UNESCAPED_UNICODE);
            break;
        }

        $id = intval($_GET['id']);
        $consulta = $conexion->prepare('DELETE FROM peliculas_series WHERE id = :id');
        $consulta->execute([':id' => $id]);

        if ($consulta->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'No existe contenido con ese ID'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(204);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
}
