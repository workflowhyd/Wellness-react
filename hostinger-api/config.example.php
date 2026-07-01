<?php
// Copy this file to config.php on the SERVER ONLY (not in git) and fill in real values.
// config.php is gitignored on purpose — never commit real DB credentials or the admin password.

// ---- Hostinger MySQL credentials ----
// hPanel → Databases → MySQL Databases. Create a database + user there first,
// then fill in the three values below (DB_HOST is almost always "localhost").
define('DB_HOST', 'localhost');
define('DB_NAME', 'REPLACE_WITH_YOUR_DB_NAME');
define('DB_USER', 'REPLACE_WITH_YOUR_DB_USER');
define('DB_PASS', 'REPLACE_WITH_YOUR_DB_PASSWORD');

// ---- Admin Dashboard password ----
// Pick a strong password here — this gates access to student data.
define('ADMIN_PASSWORD', 'REPLACE_WITH_A_STRONG_PASSWORD');

// ---- Frontend origin ----
// The exact URL your React site is served from (no trailing slash). Since the
// frontend (Hostinger's static build/deploy) and this API (classic hPanel
// hosting) live on different domains, the browser needs an explicit origin
// here — "*" does not work once the admin login relies on session cookies.
// Example: https://deepskyblue-jackal-392124.hostingersite.com
define('ALLOWED_ORIGIN', 'REPLACE_WITH_YOUR_FRONTEND_URL');

function start_session_safe() {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        // SameSite=None (needed for a cross-site fetch to carry the cookie) requires
        // Secure, which requires real HTTPS — fall back to Lax/non-secure so this
        // still works over plain http during local testing.
        $isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'samesite' => $isHttps ? 'None' : 'Lax',
            'secure' => $isHttps,
            'httponly' => true,
        ]);
        session_start();
    }
}

function require_admin_session() {
    start_session_safe();
    if (empty($_SESSION['admin'])) {
        json_response(['error' => 'Unauthorized'], 401);
    }
}

function get_db() {
    try {
        return new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    } catch (PDOException $e) {
        json_response(['error' => 'Database connection failed'], 500);
    }
}

function json_response($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function send_cors_headers() {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
