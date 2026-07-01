<?php
require __DIR__ . '/config.php';
send_cors_headers();
require_admin_session();

$pdo = get_db();
$stmt = $pdo->query(
    'SELECT id, first_name, last_name, phone, email, course, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 200'
);

json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
