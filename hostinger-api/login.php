<?php
require __DIR__ . '/config.php';
send_cors_headers();
start_session_safe();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$password = (string) ($input['password'] ?? '');

if (!hash_equals(ADMIN_PASSWORD, $password)) {
    json_response(['error' => 'Invalid password'], 401);
}

$_SESSION['admin'] = true;
json_response(['success' => true]);
