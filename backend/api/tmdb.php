<?php

require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const TMDB_URL = 'https://api.themoviedb.org/3';

$MAPEO_GENEROS = [
    28 => 'Acción',
    12 => 'Aventura',
    16 => 'Animación',
    35 => 'Comedia',
    80 => 'Crimen',
    99 => 'Documental',
    18 => 'Drama',
    14 => 'Fantasía',
    27 => 'Terror',
    878 => 'Ciencia ficción',
    9648 => 'Misterio',
    10749 => 'Romance',
    53 => 'Suspenso',
];

$consulta = trim($_GET['q'] ?? '');
if ($consulta === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el parámetro q'], JSON_UNESCAPED_UNICODE);
    exit;
}

$url = TMDB_URL . '/search/multi?' . http_build_query([
    'api_key' => TMDB_API_KEY,
    'query' => $consulta,
    'language' => 'es-ES',
    'include_adult' => 'false',
    'page' => 1,
]);

$contexto = stream_context_create([
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
]);

$respuesta = @file_get_contents($url, false, $contexto);

if ($respuesta === false) {
    http_response_code(502);
    echo json_encode(['error' => 'TMDB no respondió'], JSON_UNESCAPED_UNICODE);
    exit;
}

$datos = json_decode($respuesta, true);

$resultados = [];
foreach ($datos['results'] ?? [] as $item) {
    if ($item['media_type'] !== 'movie' && $item['media_type'] !== 'tv') {
        continue;
    }

    $generos = [];
    foreach ($item['genre_ids'] ?? [] as $id) {
        if (isset($MAPEO_GENEROS[$id])) {
            $generos[] = $MAPEO_GENEROS[$id];
        }
    }

    $resultados[] = [
        'id' => $item['id'],
        'tipo' => $item['media_type'] === 'movie' ? 'pelicula' : 'serie',
        'titulo' => $item['title'] ?? $item['name'],
        'anio' => substr($item['release_date'] ?? $item['first_air_date'] ?? '', 0, 4),
        'generos' => $generos,
        'poster_path' => $item['poster_path'],
    ];
}

echo json_encode($resultados, JSON_UNESCAPED_UNICODE);