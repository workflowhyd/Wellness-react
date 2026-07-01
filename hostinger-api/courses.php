<?php
require __DIR__ . '/config.php';
send_cors_headers();
require_admin_session();

$pdo = get_db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, title FROM courses ORDER BY id');
    json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $title = trim($input['title'] ?? '');
    if ($title === '') {
        json_response(['error' => 'title is required'], 422);
    }
    $stmt = $pdo->prepare('INSERT INTO courses (title) VALUES (:title)');
    $stmt->execute(['title' => $title]);
    json_response(['success' => true, 'id' => (int) $pdo->lastInsertId()]);
}

if ($method === 'PATCH') {
    parse_str($_SERVER['QUERY_STRING'] ?? '', $query);
    $id = (int) ($query['id'] ?? 0);
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $title = trim($input['title'] ?? '');
    if ($id <= 0 || $title === '') {
        json_response(['error' => 'id and title are required'], 422);
    }
    $stmt = $pdo->prepare('UPDATE courses SET title = :title WHERE id = :id');
    $stmt->execute(['title' => $title, 'id' => $id]);
    json_response(['success' => true]);
}

if ($method === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'] ?? '', $query);
    $id = (int) ($query['id'] ?? 0);
    if ($id <= 0) {
        json_response(['error' => 'id is required'], 422);
    }
    $stmt = $pdo->prepare('DELETE FROM courses WHERE id = :id');
    $stmt->execute(['id' => $id]);
    json_response(['success' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
