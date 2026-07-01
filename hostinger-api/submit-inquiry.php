<?php
require __DIR__ . '/config.php';
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

$firstName = trim($input['firstName'] ?? '');
$lastName  = trim($input['lastName'] ?? '');
$phone     = trim($input['phone'] ?? '');
$email     = trim($input['email'] ?? '');
$course    = trim($input['course'] ?? '');
$message   = trim($input['message'] ?? '');

if ($firstName === '' || $phone === '') {
    json_response(['error' => 'First name and phone number are required'], 422);
}

$pdo = get_db();
$stmt = $pdo->prepare(
    'INSERT INTO inquiries (first_name, last_name, phone, email, course, message) VALUES (:first_name, :last_name, :phone, :email, :course, :message)'
);
$stmt->execute([
    'first_name' => $firstName,
    'last_name'  => $lastName,
    'phone'      => $phone,
    'email'      => $email,
    'course'     => $course,
    'message'    => $message,
]);

json_response(['success' => true, 'id' => (int) $pdo->lastInsertId()]);
