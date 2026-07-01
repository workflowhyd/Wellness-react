<?php
require __DIR__ . '/config.php';
send_cors_headers();

$regNo = trim($_GET['reg_no'] ?? '');
if ($regNo === '') {
    json_response(['error' => 'reg_no is required'], 422);
}

$pdo = get_db();
$stmt = $pdo->prepare(
    'SELECT registration_no, name, dob, guardian_name, course_duration_days, batch, trained_in FROM certificates WHERE registration_no = :reg_no'
);
$stmt->execute(['reg_no' => $regNo]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

json_response($row ?: null);
